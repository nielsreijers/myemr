using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySqlConnector;

namespace SoundAndKeyLoggerWinForm
{
    public class DbLogger : IDisposable
    {
        MySqlConnection conn;
        long? uuid = null;

        public DbLogger()
        {
            string connStr = "server=localhost;user=root;database=imagedescription;port=3306;password=1234";
            conn = new MySqlConnection(connStr);
            try
            {
                Console.WriteLine("Connecting to MySQL...");
                conn.Open();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        public void Log(string type, string data)
        {
            try
            {
                DateTime now = DateTime.Now;
                string nowString = now.ToString("yyyy-MM-dd HH:mm:ss.fff");
                long nowUnix = ((DateTimeOffset)now).ToUnixTimeMilliseconds();
                if (uuid == null)
                {
                    uuid = nowUnix;
                }

                string sql = $@"insert into logger_traces (user_id, uuid, time, unix_time, type, data)
                                values(8, {uuid.Value}, '{nowString}', {nowUnix}, '{type}', '{data}')";
                Console.WriteLine(sql);
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        #region IDisposable Support
        private bool disposedValue = false; // To detect redundant calls

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    if (conn != null)
                    {
                        conn.Close();
                    }
                }

                // TODO: free unmanaged resources (unmanaged objects) and override a finalizer below.
                // TODO: set large fields to null.

                disposedValue = true;
            }
        }

        // TODO: override a finalizer only if Dispose(bool disposing) above has code to free unmanaged resources.
        // ~DbLogger()
        // {
        //   // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
        //   Dispose(false);
        // }

        // This code added to correctly implement the disposable pattern.
        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
            // TODO: uncomment the following line if the finalizer is overridden above.
            // GC.SuppressFinalize(this);
        }
        #endregion
    }
}
