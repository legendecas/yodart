# Functional Requirements

All [YODAOS][] expect a familiar experience, this document describes functional and design requirements to help
you meet customer expectations and avoid issues as you develop, prototype and prepare your product with YODAOS.

Note that the document is a sub-set of [Alexa Functional Requirements][], products SHOULD follow the requirements
of [Alexa Functional Requirements][] for Alexa authorized products.

### Common terms

The following terms are used consistently throughout this document to signify requirements and recommendations:

- `SHALL`: Items preceded by SHALL are required for all commercial product releases.
- `SHOULD`: Items preceded by SHOULD are recommended for all commercial product releases and significantly improve the YodaOS customer experience.

The following terms are used consistently throughout this document to describe YodaOS features and concepts:

- **Voice-initiated**: Products activated by customer speech for a hands-free experience. They can also be activated by a customer's touch.
- **Touch-initiated**: Products activated by a customer’s physical action on the product. These products do not support voice-initiated interactions.
- **Tap-to-talk**: Touch-initiated products activated by the customer pushing and releasing a button before speaking.
- **Hold-to-talk**: Touch-initiated products activated by the customer holding down a button while speaking.
- **Attention states**: The parts of an YODAOS conversation flow, including listening and thinking.
- **Physical control**: A hardware or GUI control that is used to wake YODAOS or adjust the product's settings.
- **Visual cues**: Visual cues are LEDs or GUI elements that provide feedback to the customer on YODAOS's state.
- **Audio cues**: Audio cues are sounds that provide feedback to the customer on YODAOS's transitions between attention states.

### Core requirements and recommendations

The following requirements and recommendations are applicable to all products with YODAOS enabled.

- Your product SHALL be capable of audio input (i.e. capturing customer speech via one or more microphones) and streaming captured speech to the cloud per the specs provided in the SpeechRecognizer Interface.
- Your product SHALL be capable of audio output (e.g. speaker, headphones, line out, or Bluetooth).
  - Your product SHOULD provide physical controls for adjusting volume.
- Your product SHALL provide a physical control to manually initiate an interaction with YODAOS.
  - Your product SHALL enable customers to interrupt an voice-initiated output (e.g. media playback or TTS) using voice or a physical control. The physical control.
  - If you choose to implement a GUI control, it SHALL always be accessible from your user interface and cannot be hidden at any time.
  - The physical control SHOULD only have the single purpose of initiating voice interactions.
- Your product SHALL clearly convey core attention states to the customer. The core attention states are listening, thinking and speaking.
  - Your product SHOULD use prominent visual cues to this requirement.
  - If your product uses both visual and audio cues to this requirement, the visual and audio cues SHALL be synchronized to indicate when the device listening state starts and when it stops.
- Your product SHALL support silencing alerts, adjusting volume, and stopping media when internet connectivity is unavailable.

### Voice-initiated products

The following guidelines are specific to voice-initiated products and extend the core requirements and recommendations for those products.

- Your product SHALL use any wake words.
- Your product SHALL provide an always-available control to disable its microphones, and SHALL use visual cues clearly and continually to convey to the customer that the YODAOS microphone off attention state is active.
  - You SHALL provide audio cues to indicate when the microphone off attention state is activated and deactivated.
- Your product SHALL support enabling/disabling microphones when internet connectivity is unavailable.
- Your product SHALL support cloud-based wake word verification.

### Touch-initiated products

The following guidelines are specific to touch-initiated products and extend the core requirements and recommendations for those products. Unless noted, the guidelines apply to both tap-to-talk and hold-to-talk products.

- Your product SHALL NOT require the use of a wake word as part of the customer utterance.
- Your product's microphones SHALL be disabled until customer initiates a voice interaction.
- Your product SHALL use audio cues to indicate the start and end of the listening attention state.

### Media service

The following guidelines apply to all products that support media services. All of the below guidelines apply to both voice-initiated and touch-initiated products.

- Your product SHALL pause or attenuate (lower speaker volume) audio output when a customer initiates a voice interaction during media playback.
  - Your product SHALL pause audible content playback when interrupted by a customer.
  - If your product pauses media because of a customer interruption, it SHOULD resume playback automatically.
- Your product SHALL allow customers to resume paused media using a voice request or a physical control.
- Your product SHOULD sufficiently buffer media so that short interruptions in internet connectivity do not disrupt playback.

### Alerts

The following guidelines apply to delivering and controlling alerts, such as timers or alarms.

- Your product SHALL deliver previously scheduled alerts to customers when internet connectivity is unavailable.
  - If alerts are delivered while internet connectivity is unavailable, your product SHALL send the appropriate events for the delivered alerts to Alexa when an internet connection is reestablished.
- Your product SHOULD support the use of physical controls to stop sounding alerts.
- Your product SHOULD support independent volume control for alerts. When a customer adjusts a product’s volume for media output, it SHOULD NOT affect the volume for alerts.

### Setup and authentication

The YODAOS setup process communicates the value of YODAOS and helps customers connect your product to their account. Ideally, the YODAOS setup flow should be incorporated into the setup or first run experience on your product.

- YODAOS uses Rokid Account to authenticate the customer, however your product SHALL use other authenticated service by yourself.
- Your product SHALL support logout by the customer.
- You SHOULD include information on YODAOS setup and use in your product's instructional materials.

### Bluetooth

These requirements are specific to products that use the bluetooth interface:

- Your product SHOULD support the Advanced Audio Distribution Profile (A2DP) bluetooth profile.
  - If your product supports A2DP, it SHALL support receiving digital audio streams from an A2DP SOURCE device.
  - If your product supports A2DP, it SHALL support the Audio/Video Remote Control Profile (AVRCP) profile.
- If your product uses the bluetooth interface, it SHALL use the bluetooth sounds provided by Amazon.

[YODAOS]: https://github.com/yodaos-project/yodaos
[Alexa Functional Requirements]: https://developer.amazon.com/docs/alexa-voice-service/functional-requirements.html
