#pragma once

#include <stdint.h>
#include <mutex>
#include "pulse/simple.h"
#include "pulse/error.h"
#include "thr-pool.h"

#define PLAYER_PENDING 0
#define PLAYER_PLAYING 1
#define PLAYER_CANCELLED 2

typedef enum {
  pcm_player_started = 0,
  pcm_player_ended,
  pcm_player_cancelled,
} PcmPlayerEvent;

typedef std::function<void(PcmPlayerEvent e)> EventListener;

class PcmPlayer {
 public:
  PcmPlayer(EventListener l) : onevent(l){};
  ~PcmPlayer() {
    destroy();
  };
  bool init(pa_sample_spec ss);
  void destroy();

  void write(std::vector<uint8_t>& data);
  void end();
  void cancel();

 private:
  EventListener onevent;
  pa_simple* stream = nullptr;
  ThreadPool* tp;
  ThreadPool* drainp;
  uint8_t status = PLAYER_PENDING;
};
