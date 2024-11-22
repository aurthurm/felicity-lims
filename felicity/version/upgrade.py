import asyncio
import datetime
import shutil
import xmlrpc.client
from pathlib import Path
from typing import Dict

import alembic.config
import docker
import git
from fastapi import HTTPException


class SupervisorSystemUpgrade:
    def __init__(self):
        self.repo_path = Path("/path/to/felicity", )
        self.backup_dir = Path("/path/to/backups")
        self.db_url = "postgresql://user:pass@localhost/felicity"
        self.alembic_ini_path = "/path/to/alembic.ini"
        self._upgrade_lock = asyncio.Lock()
        self.supervisor = xmlrpc.client.ServerProxy("http://localhost:9001/RPC2")

    async def create_backup(self) -> Path:
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = self.backup_dir / f"backup_{timestamp}"

        # Backup code
        shutil.copytree(self.repo_path, backup_path / "code")

        # Backup database
        db_backup_file = backup_path / "database.sql"
        proc = await asyncio.create_subprocess_exec(
            "pg_dump", "-f", str(db_backup_file), self.db_url,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        await proc.communicate()

        return backup_path

    async def git_pull(self) -> str:
        repo = git.Repo(self.repo_path)
        origin = repo.remotes.origin
        origin.pull()
        return repo.head.commit.hexsha

    async def upgrade_database(self):
        config = alembic.config.Config(self.alembic_ini_path)
        with config.get_engine().begin() as connection:
            config.attributes['connection'] = connection
            alembic.command.upgrade(config, "head")

    async def reload_system(self):
        # Stop the service
        self.supervisor.supervisor.stopProcess('felicity')
        # Wait for stop
        await asyncio.sleep(5)
        # Start the service
        self.supervisor.supervisor.startProcess('felicity')

        # Verify status
        info = self.supervisor.supervisor.getProcessInfo('felicity')
        if info['statename'] != 'RUNNING':
            raise Exception("Failed to restart service")

    async def restore_backup(self, backup_path: Path):
        # Restore code
        shutil.rmtree(self.repo_path)
        shutil.copytree(backup_path / "code", self.repo_path)

        # Restore database
        proc = await asyncio.create_subprocess_exec(
            "psql", self.db_url, "-f", str(backup_path / "database.sql"),
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        await proc.communicate()

        await self.reload_system()

    async def perform_upgrade(self) -> Dict:
        async with self._upgrade_lock:
            try:
                # Create backup first
                backup_path = await self.create_backup()

                # Perform upgrade steps
                commit_hash = await self.git_pull()
                await self.upgrade_database()
                await self.reload_system()

                return {
                    "status": "success",
                    "backup_path": str(backup_path),
                    "commit_hash": commit_hash
                }

            except Exception as e:
                # Attempt recovery
                if backup_path:
                    await self.restore_backup(backup_path)
                raise HTTPException(
                    status_code=500,
                    detail=f"Upgrade failed: {str(e)}. System restored to backup."
                )


# Sudoers configuration
"""
# /etc/sudoers.d/felicity-upgrade
felicity ALL=(ALL) NOPASSWD: /usr/bin/pg_dump
felicity ALL=(ALL) NOPASSWD: /usr/bin/psql
felicity ALL=(ALL) NOPASSWD: /usr/bin/supervisorctl
"""

""" add to supervisor config
[inet_http_server]
port=127.0.0.1:9001
username=felicity
password=your_secure_password
"""


class DockerSystemUpgrade:
    def __init__(self,
                 container_name: str,
                 repo_path: str,
                 backup_dir: str,
                 db_url: str):
        self.container_name = container_name
        self.repo_path = Path(repo_path)
        self.backup_dir = Path(backup_dir)
        self.db_url = db_url
        self.docker_client = docker.from_env()

    async def reload_system(self):
        container = self.docker_client.containers.get(self.container_name)
        container.restart(timeout=30)

    async def execute_in_container(self, command: str) -> str:
        container = self.docker_client.containers.get(self.container_name)
        result = container.exec_run(command)
        if result.exit_code != 0:
            raise Exception(f"Command failed: {result.output.decode()}")
        return result.output.decode()

    async def upgrade_database(self):
        await self.execute_in_container("alembic upgrade head")

    async def create_backup(self) -> Path:
        container = self.docker_client.containers.get(self.container_name)
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = self.backup_dir / f"backup_{timestamp}"
        backup_path.mkdir(parents=True)

        # Backup database using docker exec
        db_backup_file = backup_path / "database.sql"
        await self.execute_in_container(f"pg_dump -f {db_backup_file} {self.db_url}")

        # Backup code
        shutil.copytree(self.repo_path, backup_path / "code")

        return backup_path

    async def perform_upgrade(self) -> Dict:
        try:
            backup_path = await self.create_backup()
            await self.git_pull()
            await self.upgrade_database()
            await self.reload_system()

            return {
                "status": "success",
                "backup_path": str(backup_path)
            }
        except Exception as e:
            if backup_path:
                await self.restore_backup(backup_path)
            raise

#
#
# @version.post("/supervisor/upgrade")
# async def trigger_upgrade(background_tasks: BackgroundTasks):
#     background_tasks.add_task(SupervisorSystemUpgrade().perform_upgrade)
#     return {"status": "upgrade_initiated"}
#
#
# @version.post("/supervisor/restore/{backup_id}")
# async def restore_system(backup_id: str):
#     backup_path = Path(SupervisorSystemUpgrade().backup_dir) / backup_id
#     if not backup_path.exists():
#         raise HTTPException(status_code=404, detail="Backup not found")
#     await SupervisorSystemUpgrade().restore_backup(backup_path)
#     return {"status": "restore_complete"}
