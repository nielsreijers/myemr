using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace SoundAndKeyLoggerWinForm
{
    public class WavWriter
    {
        private const int BUFLEN = 512 * 1024;
        private string directory;
        private uint samplerate;

        private byte[] buffer;
        private uint noBytesInBuffer;
        private uint noFileWritten;

        public WavWriter(string directory, uint samplerate)
        {
            this.directory = directory;
            this.samplerate = samplerate;

            Directory.CreateDirectory(directory);
            buffer = new byte[BUFLEN];
            noBytesInBuffer = 0;
            noFileWritten = 0;
        }

        public void Write(byte[] data, uint noBytes)
        {
            if (noBytes + noBytesInBuffer > BUFLEN)
            {
                Flush();
            }
            Array.Copy(data, 0, buffer, noBytesInBuffer, noBytes);
            noBytesInBuffer += noBytes;
        }

        public void Close()
        {
            Flush();
        }

        private void Flush()
        {
            long unixtime = ((DateTimeOffset)DateTime.Now).ToUnixTimeMilliseconds();
            string filename = $"{directory}\\{noFileWritten++.ToString("000000")}-{unixtime}.wav";
            File.WriteAllBytes(filename, encodeWAV(buffer, samplerate, noBytesInBuffer));
            buffer = new byte[BUFLEN];
            noBytesInBuffer = 0;
        }

        //function floatTo16BitPCM(output, offset, input)
        //{
        //    for (var i = 0; i < input.length; i++, offset += 2)
        //    {
        //        var s = Math.max(-1, Math.min(1, input[i]));
        //        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        //    }
        //}
        private static void writeString(byte[] buffer, int offset, string s)
        {
            Array.Copy(Encoding.ASCII.GetBytes(s), 0, buffer, offset, s.Length);
        }
        private static void setUint16LE(byte[] buffer, int offset, ushort value)
        {
            Array.Copy(BitConverter.GetBytes(value), 0, buffer, offset, 2);
        }
        private static void setUint32LE(byte[] buffer, int offset, uint value)
        {
            Array.Copy(BitConverter.GetBytes(value), 0, buffer, offset, 4);
        }
        private static byte[] encodeWAV(byte[] samples, uint samplerate, uint numberOfBytes)
        {
            var buffer = new byte[44 + numberOfBytes];
            ushort numChannels = 1;

            /* RIFF identifier */
            writeString(buffer, 0, "RIFF");
            /* RIFF chunk length */
            setUint32LE(buffer, 4, (uint)36 + numberOfBytes);
            /* RIFF type */
            writeString(buffer, 8, "WAVE");
            /* format chunk identifier */
            writeString(buffer, 12, "fmt ");
            /* format chunk length */
            setUint32LE(buffer, 16, 16);
            /* sample format (raw) */
            setUint16LE(buffer, 20, 1);
            /* channel count */
            setUint16LE(buffer, 22, numChannels);
            /* sample rate */
            setUint32LE(buffer, 24, samplerate);
            /* byte rate (sample rate * block align) */
            setUint32LE(buffer, 28, samplerate * 4);                  /// Is this correct, or should it be * 2?
            /* block align (channel count * bytes per sample) */
            setUint16LE(buffer, 32, (ushort)(numChannels * 2));
            /* bits per sample */
            setUint16LE(buffer, 34, 16);
            /* data chunk identifier */
            writeString(buffer, 36, "data");
            /* data chunk length */
            setUint32LE(buffer, 40, numberOfBytes * 2);

            Array.Copy(samples, 0, buffer, 44, numberOfBytes);
            //floatTo16BitPCM(view, 44, samples);

            return buffer;
        }
    }
}
