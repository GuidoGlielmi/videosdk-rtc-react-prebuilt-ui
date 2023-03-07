import {useMeeting, useParticipant} from '@videosdk.live/react-sdk';
import React, {useContext, useEffect, useRef} from 'react';
// import { transcriptionsContext } from '../../contexts/TranscriptionsContext';

// You can set the Region using the AWS_REGION environment variable, the SDK for JavaScript reads and uses it.
// const TRANSCRIBE_ENDPOINT = 'transcribe.us-west-2.amazonaws.com';
const ParticipantAudioPlayer = ({participantId}) => {
  // const {setCurrentTranscription} = useContext(transcriptionsContext)
  const {micOn, micStream, isLocal, consumeMicStreams, stopConsumingMicStreams} = useParticipant(participantId);
  const audioPlayer = useRef();

  useEffect(() => {
    if (!isLocal) {
      consumeMicStreams();
      return () => {
        stopConsumingMicStreams();
      };
    }
    
    // getAWSTranscription()
  }, []);
  useEffect(() => {
    if (!isLocal && audioPlayer.current && micOn && micStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(micStream.track);
      audioPlayer.current.srcObject = mediaStream;
      audioPlayer.current.play().catch(err => {
        if (
          err.message ===
          "play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD"
        ) {
          console.error('audio' + err.message);
        }
      });
    } else {
      audioPlayer.current.srcObject = null;
    }
  }, [micStream, micOn, isLocal, participantId]);

  return <audio autoPlay playsInline controls={false} ref={audioPlayer} />;
};

const ParticipantsAudioPlayer = () => {
  const mMeeting = useMeeting();

  const participants = mMeeting?.participants;
  return participants ? (
    [...participants.keys()].map(participantId => (
      <ParticipantAudioPlayer key={`participant_audio_${participantId}`} participantId={participantId} />
    ))
  ) : (
    <></>
  );
};

export default ParticipantsAudioPlayer;

/*

It is strongly recommended to not use the root user for your everyday tasks. Safeguard your root user credentials and use them to perform the tasks that only the root user can perform.
For centralized access management, it's recommended to use AWS IAM Identity Center.
To manage access in AWS, you must create policies and attach them to IAM identities (users, groups, or
roles) or resources.

A policy defines the permissions of the entity it is attached to.
For example, a role can only access a media file located in your Amazon S3 bucket if you've attached a policy to that role which grants it access.
If you want to further restrict that role, you can instead limit its access to a specific file within an Amazon S3 buckets.

To ensure that an entity (users and roles) can use the AWS Management Console, attach one of the
following AWS-managed policies to them.
• AmazonTranscribeFullAccess: Grants full access to create, read, update, delete, and run all
Amazon Transcribe resources. It also allows access to Amazon S3 buckets with transcribe in the
bucket name.

// import MicrophoneStream from 'microphone-stream';
// import {TranscribeStreamingClient, StartStreamTranscriptionCommand} from '@aws-sdk/client-transcribe-streaming';

const AWS_REGION = process.env.REACT_APP_AWS_REGION;
const AWS_ACCESS_KEY = process.env.REACT_APP_AWS_ACCESS_KEY;
const AWS_SECRET_ACCESS_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;

const getAWSTranscription = async () => {
      // Running this code might result in charges to your AWS account.
      const micStream = new MicrophoneStream();
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});
      const streamSampleRate = stream.getAudioTracks()[0].getSettings().sampleRate;
      micStream.setStream(stream);
      const MAX_CHUNK_LENGTH = 48000;
      const audioStream = async function* () {
        for await (const chunk of micStream) {
          if (chunk.length <= MAX_CHUNK_LENGTH) {
            yield {
              AudioEvent: {
                AudioChunk: pcmEncodeChunk(chunk),
              },
            };
          }
        }
      };
      const credentials = {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      };
      const client = new TranscribeStreamingClient({
        region: AWS_REGION,
        credentials,
      });
      const params = {
        MediaEncoding: 'pcm',
        LanguageCode: 'es-US',
        // SampleRate: '',
        MediaSampleRateHertz: streamSampleRate || MAX_CHUNK_LENGTH.toString(), // The sample rate must match the sample rate in the audio file.
        AudioStream: audioStream(),
      };
      try {
        const command = new StartStreamTranscriptionCommand(params);
        // Send transcription request
        const response = await client.send(command);
        // Start to print response
        for await (const event of response.TranscriptResultStream) {
          const results = event.TranscriptEvent?.Transcript?.Results;
          if (results.length) {
            const currentTranscription = results?.[0]?.Alternatives?.[0]?.Transcript;
            setCurrentTranscription(currentTranscription)
          }
        }
      } catch (err) {
        console.log(err);
        micStream.stop();
        micStream.destroy();
      }
    };

const pcmEncodeChunk = chunk => {
  const input = MicrophoneStream.toRaw(chunk);
  var offset = 0;
  var buffer = new ArrayBuffer(input.length * 2);
  var view = new DataView(buffer);
  for (var i = 0; i < input.length; i++, offset += 2) {
    var s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return Buffer.from(buffer);
};

*/
