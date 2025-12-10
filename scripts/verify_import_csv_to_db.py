import os
import psycopg2# type: ignore
def verify_imported_data():
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST", "db"),
        port=os.getenv("DB_PORT", "5432")   ,
        database=os.getenv("DB_NAME", "bridge_db"),
        user=os.getenv("DB_USER", "bridge_manager"),
        password=os.getenv("DB_PASSWORD", "g0lden_gat3")
    )
    # Create a cursor object
    with conn.cursor() as cur:
        # Execute a query to fetch all data from the bridges table
        cur.execute("SELECT bridge_id, name, ST_AsText(location) FROM bridges;")
      
        # Fetch all rows from the executed query
        rows = cur.fetchall()
      
        # Print the column headers
        print("bridge_id | name | location")
        print("----------|------|----------|")
      
        # Print all rows
        for row in rows:
            print(f"{row[0]} | {row[1]} | {row[2]}")
    # Close the connection
    conn.close()
# Call the function to verify the imported data
if __name__ == "__main__":
    verify_imported_data()