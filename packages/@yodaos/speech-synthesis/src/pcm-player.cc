#include <stdint.h>
#include "pulse/simple.h"
#include "pulse/error.h"
#include "pcm-player.h"

bool PcmPlayer::init(pa_sample_spec ss) {
  if (stream)
    return true;

  tp = new ThreadPool(1);
  drainp = new ThreadPool(1);
  int err;
  stream = pa_simple_new(nullptr, "speech-synthesizer", PA_STREAM_PLAYBACK,
                         nullptr, "tts", &ss, nullptr, nullptr, &err);
  if (stream == nullptr)
    fprintf(stderr, "pulseaudio create failed: %s", pa_strerror(err));
  return stream != nullptr;
}

void PcmPlayer::destroy() {
  if (stream) {
    pa_simple_free(stream);
    stream = nullptr;
  }
  tp->close();
  delete tp;
  drainp->close();
  delete drainp;
}

void PcmPlayer::write(std::vector<uint8_t>& data) {
  if (stream == nullptr) {
    return;
  }
  if (status == PLAYER_CANCELLED) {
    return;
  }
  if (status == PLAYER_PENDING) {
    status = PLAYER_PLAYING;
    onevent(pcm_player_started);
  }

  tp->push([this, data]() {
    if (status != PLAYER_PLAYING) {
      return;
    }
    int err;
    if (pa_simple_write(stream, data.data(), data.size(), &err) < 0) {
    }
  });
}

void PcmPlayer::end() {
  drainp->push([this]() {
    if (status != PLAYER_PLAYING) {
      return;
    }
    int err;
    if (pa_simple_drain(stream, nullptr) < 0) {
    }
    // TODO: Event Cancel/End

    if (status == PLAYER_CANCELLED) {
      onevent(pcm_player_cancelled);
    } else if (status == PLAYER_PLAYING) {
      onevent(pcm_player_ended);
    }
    status = PLAYER_PENDING;
  });
}

void PcmPlayer::cancel() {
  status = PLAYER_CANCELLED;
  int err;
  pa_simple_flush(stream, &err);
  tp->finish();
}
