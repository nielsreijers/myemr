import mysql.connector as mysql
import re

def queryDb(query, args=()):
    try:
        conn = mysql.connect(user="root",
                             password="1234",
                             host="localhost",
                             port=3306,
                             database="imagedescription")
    except mysql.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)

    # Get Cursor
    cur = conn.cursor()

    cur.execute(query, args)
    data = [x for x in cur]
    cur.close()
    return data
    
def getAllTraceEvents(directory):
    starttime = int(re.search(".*-(\d*)", directory).group(1))
    q = f"""select time, unix_time, type, data from logger_traces where uuid = (select uuid from logger_traces lt where type='recorder-start' and data like '%{starttime}') order by id"""
    return queryDb(q, ())
