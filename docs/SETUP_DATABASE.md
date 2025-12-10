# Setup the database

## Installation (Linux)

### Install PostgreSQL (Linux)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### Install PostGIS extension (Linux)

```bash
sudo apt install postgis postgresql-<version>-postgis-3
```

Replace `<version>` with the specific version numbers of PostgreSQL you are using. The `3` always refers to the latest `postgis` version available. For example, if you are using PostgreSQL 16:

```bash
sudo apt install postgis postgresql-13-postgis-3
```

Verify that PostGIS is installed correctly by running a query to check the PostGIS version:

```sql
SELECT PostGIS_Version();
```

To exit the PostgreSQL prompt, type `\q`.
To exit the PostgreSQL User Session, type `exit`.

## Installation (Windows)

### Install PostgreSQL (Windows)

[Download and install PostgreSQL](https://www.postgresql.org/download/windows/).

Keep the Application Stack Builder to install PostGIS extension later. Don't forget the password and the listening port (default: `5432`) set during the installation.

The path to the `PostgreSQL\16\bin` folder should be in the `PATH` variable. You can check that PosgreSQL is successfully installed with:

```powershell
psql --version
```

You can log into your database (default user: `postgres` with the password set up above):

```powershell
psql -U postgres
```

### Install PostGIS extension (Windows)

* Launch `Application Stack Builder`.
* Select your database version and port.
* Select, download and install PostGIS in `Categories/Spatial Extensions/PostGIS`.

## Create a PostgreSQL database with PostGIS extension

### Create database

Linux:

```bash
sudo -i -u postgres psql
```

Windows:

```powershell
psql -U postgres
```

The DB name is `bridge_db`:

```sql
CREATE DATABASE bridge_db;
```

### Connect to the db

```sql
\c bridge_db
```

### Enable PostGIS Extension

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### Verify that PostGIS is installed by listing the extensions in the database

```sql
SELECT * FROM pg_extension;
```

## Create Tables inside the database

```sql
CREATE TABLE bridges (
    bridge_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100),
    location GEOGRAPHY(Point, 4326)
    );
```

## Create a `bridge_manager` user

```sql
CREATE USER bridge_manager WITH PASSWORD 'g0lden_gat3';
```

## Grant all privileges on the `bridges` table to the `bridge_manager` user

Make sure you connect to the database first:

```sql
\c bridge_db
```

Then:

```sql
GRANT ALL PRIVILEGES ON TABLE bridges TO bridge_manager;
GRANT ALL PRIVILEGES ON SCHEMA public TO bridge_manager;
GRANT ALL PRIVILEGES ON DATABASE bridge_db TO bridge_manager;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bridge_manager;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO bridge_manager;
```

## Import data into the database from a CSV file

```bash
py import_csv_to_db.py
```

You may use this script to verify that the data has been successfully inserted into the database:

```bash
py verify_import_csv_to_db.py 
```

or verify manually by querying the table:

```sql
\c bridge_db;
SELECT * FROM bridges;
```

You should get something like this:

```sql
 bridge_id |               name                 |                      location                      
-----------+------------------------------------+----------------------------------------------------
 B035      | Avenue Emile Henriot              | 0101000020E610000070729CCCD3D75EC05052A42824424240 
 B036      | Vieux Chemin de Gairaut           | 0101000020E6100000B43E13DBB8F75EC03F5B6E1F36F04240 
 B038      | Ligne de Nice à Breil-sur-Roya    | 0101000020E6100000B46B2171CB1E5EC07A7B83387CC84240 
 B039      | Pont Vincent Auriol               | 0101000020E6100000E7E2BFD2AA1E5EC02D07B0A97DCA4240 
 B040      | Pont des Abattoirs                | 0101000020E61000003B8A594773205EC073C879969ECB4240 
 B041      | Pont René Coty                    | 0101000020E61000006288E02DC02D5EC0ACAE84F20ECB4240 


## Useful links

* [https://johnmee.com/how-to-reinstall-postgresql-on-ubuntu](https://johnmee.com/how-to-reinstall-postgresql-on-ubuntu)
