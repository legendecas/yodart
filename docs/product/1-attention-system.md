# Attention Sytem

YODAOS attention system is comprised of non-verbal audio and visual components that work together to communicate all of YODAOS states to the customer. Color, sound, and animation are critical for effectively communicating state since there is no other visual or verbal explanation of the attention system on your product. Audio and visual cues must be synced so that YODAOS state change indicators occur simultaneously as the customer wakes, speaks to, and listens to YODAOS device.

### States

Attention states address the personality of YODAOS at a high level across all domains, there are the following state groups:

- Idle
- Interaction
- Microphone Off
- Alerts
- Do Not Distrub
- Errors

#### Idle

YODAOS device is idle when it isn’t in another state. Idle is important as it sets the initial state of YODAOS that must contrast with all other states. The easiest way to create that contrast visually is for idle to not use visuals (i.e. LEDs off) and all other states light up the LEDs or display on screen. This way the user will easily know when device is actively trying to communicate versus passively waiting for a request.

#### Interaction

The interaction states are: listening, thinking and speaking.

**Listening**

The Listening state starts when device has been initiated via wake word, tap-to-talk, and the microphone begins streaming the customer’s request to the voice service.

There are three stages to the Listening state:

- *Start Listening* When the product’s microphones have been activated, transitions into the listening state and waits for a request from the customer.
- *Active Listening* When the customer begins speaking, transitions into an active listening state.
- *End Listening* When the customer's end of speech is identified, transitions out of listening state.

The amount of visual feedback your product provides will determine the requirements for audio cues. Products without strong visual cues are required to use audio cues to indicate when device has started and stopped listening. Products with a strong visual system have the option of setting these audio cues to off by default.

**Thinking**

When a customer has completed a request, the device enters the thinking state. This state lets the customer know the microphone is no longer active and YODAOS device will respond shortly. During the thinking state, no additional voice input from the customer is accepted.

**Speaking**

The speaking state is displayed when device is responding to a request with a TTS (text to speech). This state is not displayed when  responding with long running mixable media such as music, news and games.

#### Microphone off

On a voice-initiated implementation, the customer can block YODAOS from waking by turning on the microphone off mode. In this state, the product is not capable of detecting the wake word and will not send any customer utterances to device. The microphones should be physically powered down, as well as any camera on the product. Alerts are still played when the microphone is off.

Notes:

- Voice-initiated products are required to use audio cues when the customer turns microphones on and off. The microphone on/off sounds (found below) must always be enabled, with no option for the user to disable them.
- Microphone on/off sounds must be played at the system volume level.
- The microphone on/off sounds shall play in all instances, even during TTS responses.
- Touch-initiated products do not have a microphone off state because their microphones are always off until the customer physically initiates an interaction.

#### Do not disturb

Do Not Disturb (DND) allows your customer to choose if they want to block incoming notifications and communications on a specific product. This mode is enabled per device. When Do Not Disturb is enabled, the device will not receive notifications, messages, announcements, and calls, but will allow both alerts.

#### Errors

There are the following states in errors:

- System and device errors
- Voice service unavailable
- No Wi-Fi

System errors are only displayed after a user request has failed. For example, if a product loses connection to Wi-Fi, the error would only be displayed if the user makes a request, not the moment the device lost its connection.
