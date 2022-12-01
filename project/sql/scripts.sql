CREATE TABLE data( 
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    project_name TEXT NOT NULL,
    cutoff DATE,
    contract_finish DATE,
    planned_finish DATE,
    total_mh INTEGER ,
    planned_mh INTEGER, 
    earned_mh INTEGER, 
    actual_mh INTEGER, 
    estimated_mh INTEGER,
    bluecollar_mp INTEGER,
    whitecollar_mp INTEGER,
    subcon_mp INTEGER,
    income INTEGER,
    expense INTEGER,
    invoice INTEGER,
    accrual_balance INTEGER,
    cash INTEGER,
    cash_balance INTEGER,
    date DATETIME,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(project_id) REFERENCES projects(project_id)
    );

CREATE TABLE users(
    user_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    date DATETIME
    );

CREATE TABLE projects(
    project_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,
    user_id INTEGER NOT NULL,
    project_name TEXT NOT NULL,
    project_start DATE,
    date DATETIME,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
    );