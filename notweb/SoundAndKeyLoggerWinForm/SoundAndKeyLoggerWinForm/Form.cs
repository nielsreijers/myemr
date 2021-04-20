using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace SoundAndKeyLoggerWinForm
{
    public partial class Form : System.Windows.Forms.Form
    {
        DbLogger dbLogger;
        AudioRecorder audioRecorder;

        public Form()
        {
            dbLogger = new DbLogger();
            audioRecorder = new AudioRecorder(dbLogger, 0);            
            InitializeComponent();
        }

        private void btnQuit_Click(object sender, EventArgs e)
        {
            audioRecorder.Close();
            Application.Exit();
        }

        private void textBox_KeyDown(object sender, KeyEventArgs e)
        {
            dbLogger.Log("keydown", e.KeyCode.ToString());
        }

        private void textBox_KeyUp(object sender, KeyEventArgs e)
        {
            dbLogger.Log("keyup", e.KeyCode.ToString());
        }
    }
}
