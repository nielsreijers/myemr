using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using NAudio.Wave;
using NAudio.Mixer;

namespace SoundAndKeyLoggerWinForm
{
    // Taken from https://github.com/markheath/voicerecorder
    public class AudioRecorder
    {
        string datapath = @"C:\Users\niels\git\imagedescription\web\data\videos";
        UnsignedMixerControl volumeControl;
        double desiredVolume = 100;
        WavWriter writer;
        WaveFormat recordingFormat;
        WaveIn waveIn;
        DbLogger dbLogger;

        long starttime;

        public AudioRecorder(DbLogger dbLogger, int recordingDevice)
        {
            this.dbLogger = dbLogger;
            recordingFormat = new WaveFormat(44100, 16, 1);
            waveIn = new WaveIn();
            waveIn.DeviceNumber = recordingDevice;
            waveIn.DataAvailable += OnDataAvailable;
            //waveIn.RecordingStopped += OnRecordingStopped;
            waveIn.WaveFormat = recordingFormat;
            waveIn.StartRecording();
            TryGetVolumeControl();

            this.starttime = ((DateTimeOffset)DateTime.Now).ToUnixTimeMilliseconds();
            dbLogger.Log("recorder-start", $"{starttime}");

            string directory = $"{this.datapath}\\winform-{this.starttime}";
            writer = new WavWriter(directory, 44100);
            //writer = new WaveWriter($"{directory}\\000000-{this.starttime}.wav", recordingFormat);
        }

        int totalSamples = 0;
        void OnDataAvailable(object sender, WaveInEventArgs e)
        {
            byte[] buffer = e.Buffer;
            int bytesRecorded = e.BytesRecorded;
            int samplesRecorded = bytesRecorded / 2;
            this.totalSamples += samplesRecorded;
            dbLogger.Log("recorder-mark", totalSamples.ToString());
            writer.Write(buffer, (uint)bytesRecorded);
            //writer.Write(buffer, 0, bytesRecorded);
        }

        public void Close()
        {
            writer.Close();
        }

        //public void Stop()
        //{
        //    if (recordingState == RecordingStateType.Recording)
        //    {
        //        recordingState = RecordingStateType.RequestedStop;
        //        waveIn.StopRecording();
        //    }
        //}

        private void TryGetVolumeControl()
        {
            int waveInDeviceNumber = waveIn.DeviceNumber;
            var mixerLine = waveIn.GetMixerLine();
            //new MixerLine((IntPtr)waveInDeviceNumber, 0, MixerFlags.WaveIn);
            foreach (var control in mixerLine.Controls)
            {
                if (control.ControlType == MixerControlType.Volume)
                {
                    this.volumeControl = control as UnsignedMixerControl;
                    MicrophoneLevel = desiredVolume;
                    break;
                }
            }
        }

        public double MicrophoneLevel
        {
            get
            {
                return desiredVolume;
            }
            set
            {
                desiredVolume = value;
                if (volumeControl != null)
                {
                    volumeControl.Percent = value;
                }
            }
        }
    }
}
