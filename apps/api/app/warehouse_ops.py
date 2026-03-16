from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
import json
import subprocess
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[3]
WAREHOUSE_DIR = PROJECT_ROOT / "warehouse"
DBT_DIR = WAREHOUSE_DIR / "dbt"
DUCKDB_LOADER = WAREHOUSE_DIR / "duckdb" / "load_raw_city_signals.py"
STATUS_FILE = WAREHOUSE_DIR / "warehouse_status.json"

# Use the dedicated dbt virtualenv executable on Windows
DBT_EXECUTABLE = PROJECT_ROOT / ".venv-dbt" / "Scripts" / "dbt.exe"


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def read_warehouse_status() -> dict:
    if not STATUS_FILE.exists():
        return {
            "status": "never_run",
            "last_refresh_at": None,
            "last_success_at": None,
            "last_error": None,
            "last_row_count_hint": None,
        }

    try:
        return json.loads(STATUS_FILE.read_text(encoding="utf-8"))
    except Exception as exc:
        return {
            "status": "corrupted_status_file",
            "last_refresh_at": None,
            "last_success_at": None,
            "last_error": str(exc),
            "last_row_count_hint": None,
        }


def write_warehouse_status(payload: dict) -> None:
    STATUS_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATUS_FILE.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def refresh_warehouse() -> dict:
    status = read_warehouse_status()
    status["status"] = "running"
    status["last_refresh_at"] = _utc_now_iso()
    status["last_error"] = None
    write_warehouse_status(status)

    try:
        if not DUCKDB_LOADER.exists():
            raise FileNotFoundError(f"DuckDB loader not found: {DUCKDB_LOADER}")

        if not DBT_EXECUTABLE.exists():
            raise FileNotFoundError(f"dbt executable not found: {DBT_EXECUTABLE}")

        if not DBT_DIR.exists():
            raise FileNotFoundError(f"dbt project directory not found: {DBT_DIR}")

        loader_result = subprocess.run(
            [sys.executable, str(DUCKDB_LOADER)],
            cwd=str(PROJECT_ROOT),
            capture_output=True,
            text=True,
            check=True,
        )

        dbt_debug = subprocess.run(
            [str(DBT_EXECUTABLE), "debug"],
            cwd=str(DBT_DIR),
            capture_output=True,
            text=True,
            check=True,
        )

        dbt_run = subprocess.run(
            [str(DBT_EXECUTABLE), "run"],
            cwd=str(DBT_DIR),
            capture_output=True,
            text=True,
            check=True,
        )

        row_count_hint = None
        for line in loader_result.stdout.splitlines():
            if "Loaded " in line and " records into raw_city_signals" in line:
                row_count_hint = line.strip()
                break

        success_payload = {
            "status": "ok",
            "last_refresh_at": status["last_refresh_at"],
            "last_success_at": _utc_now_iso(),
            "last_error": None,
            "last_row_count_hint": row_count_hint,
            "steps": {
                "duckdb_loader_stdout": loader_result.stdout,
                "duckdb_loader_stderr": loader_result.stderr,
                "dbt_debug_stdout": dbt_debug.stdout,
                "dbt_debug_stderr": dbt_debug.stderr,
                "dbt_run_stdout": dbt_run.stdout,
                "dbt_run_stderr": dbt_run.stderr,
            },
        }
        write_warehouse_status(success_payload)
        return success_payload

    except subprocess.CalledProcessError as exc:
        error_payload = {
            "status": "error",
            "last_refresh_at": status["last_refresh_at"],
            "last_success_at": status.get("last_success_at"),
            "last_error": {
                "returncode": exc.returncode,
                "cmd": exc.cmd,
                "stdout": exc.stdout,
                "stderr": exc.stderr,
            },
            "last_row_count_hint": status.get("last_row_count_hint"),
        }
        write_warehouse_status(error_payload)
        return error_payload

    except Exception as exc:
        error_payload = {
            "status": "error",
            "last_refresh_at": status["last_refresh_at"],
            "last_success_at": status.get("last_success_at"),
            "last_error": str(exc),
            "last_row_count_hint": status.get("last_row_count_hint"),
        }
        write_warehouse_status(error_payload)
        return error_payload