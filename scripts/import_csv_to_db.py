import csv
import os
import psycopg2

def import_data_from_csv():
    conn = None
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST", "postgres"),  # GitLab service host
            port=os.getenv("DB_PORT", "5432"),
            database=os.getenv("DB_NAME", "test_db"),
            user=os.getenv("DB_USER", "test_user"),
            password=os.getenv("DB_PASSWORD", "test_pass")
        )

        with open('./sample_bridges.csv', 'r') as file:
            reader = csv.reader(file)
            next(reader)  # skip header

            with conn.cursor() as cur:
                for row in reader:
                    bridge_id, name, latitude, longitude = row
                    cur.execute(
                        """
                        INSERT INTO bridges (bridge_id, name, location)
                        VALUES (%s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326))
                        """,
                        (bridge_id, name, longitude, latitude)
                    )

            conn.commit()
            print("Data successfully imported!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn is not None:
            conn.close()

if __name__ == "__main__":
    import_data_from_csv()
