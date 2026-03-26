import pexpect
import sys
import os

# Server details
HOST = "93.180.133.166"
USER = "root"
PASS = "Yc3SdxCspxZA!"
PROJ_DIR = "/root/memix"

def run_cmd_ssh(cmd):
    print(f"Executing over SSH: {cmd}")
    ssh_cmd = f"ssh -o StrictHostKeyChecking=no {USER}@{HOST} '{cmd}'"
    child = pexpect.spawn(ssh_cmd, timeout=600)
    i = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT])
    if i == 0:
        child.sendline(PASS)
        child.expect(pexpect.EOF)
        print(child.before.decode())
    elif i == 1:
        print("Connected / Finished.")
        print(child.before.decode())

def run_rsync():
    print("Syncing files...")
    # Basic project files
    rsync_cmd = f"rsync -avz -e 'ssh -o StrictHostKeyChecking=no' --exclude 'node_modules' --exclude '.git' --exclude '.next' --exclude 'dist' ./ {USER}@{HOST}:{PROJ_DIR}/"
    child = pexpect.spawn(rsync_cmd, timeout=300)
    i = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT])
    if i == 0:
        child.sendline(PASS)
        child.expect(pexpect.EOF)
        print("Sync complete.")
    else:
        print("Sync error.")

if __name__ == "__main__":
    # 0. Create project dir on server
    print("Preparing server directory...")
    run_cmd_ssh(f"mkdir -p {PROJ_DIR}")

    # 1. Sync files
    run_rsync()

    # 2. Run Setup
    print("Running setup script...")
    run_cmd_ssh(f"bash {PROJ_DIR}/setup_server.sh")

    # 3. Build and Start
    print("Building and starting applications...")
    run_cmd_ssh(f"bash {PROJ_DIR}/build_and_start.sh")

    print("\n✅ DEPLOYMENT FINISHED!")
    print(f"Visit http://{HOST} to see your site.")
