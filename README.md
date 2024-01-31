<p align="center">
  <img width="780" src="static/smtp_dmarc_top.png" alt="SMTP DMARC logo">
</p>

# SMTP DMARC

> A tool for retrieving DMARC reports from mailboxes using SMTP and visualizing them.

Features:

- Connects to mailboxes via SMTP
- Stores DMARC reports in MongoDB
- Easy start-up with docker compose

# How to Use

### step.1

```bash
mv .env.example .env
```

### step.2

Fill in the SMTP section of the .env file with your mailbox's connection information.

### step.3

```bash
task start
```

to launch. The browser opens at localhost:3000.

\*Note: [Task](https://taskfile.dev) needs to be installed to use the task command.

# License

MIT
