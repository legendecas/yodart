#pragma once

#define NAPI_EXPERIMENTAL
#define NAPI_VERSION 4
#include "napi.h"
#include "pcm-player.h"
#include "flora-agent.h"

class SpeechSynthesizer : public Napi::ObjectWrap<SpeechSynthesizer> {
 public:
  static Napi::Object Init(Napi::Env env, Napi::Object exports);
  SpeechSynthesizer(const Napi::CallbackInfo& info);
  ~SpeechSynthesizer();

  Napi::Value setup(const Napi::CallbackInfo& info);
  Napi::Value teardown(const Napi::CallbackInfo& info);
  Napi::Value destroy(const Napi::CallbackInfo& info);
  Napi::Value speak(const Napi::CallbackInfo& info);
  Napi::Value cancel(const Napi::CallbackInfo& info);

  void onevent(Napi::Function fn, void* data);

 private:
  PcmPlayer* player;

  flora::Agent floraAgent;
  uint8_t conn_status;
  napi_threadsafe_function tsfn;
};

#define CONN_STATUS_CONFIGURED 0x1
#define CONN_STATUS_STARTED 0x2
