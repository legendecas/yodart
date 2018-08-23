#ifndef BLUETOOTH_NATIVE_H
#define BLUETOOTH_NATIVE_H

#include <stdio.h>
#include <stdlib.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#include <iotjs.h>
#include <iotjs_def.h>
#include <iotjs_binding.h>
#include <iotjs_objectwrap.h>
#include <uv.h>
#include <librokid-bt/librokid-bt.h>

#define A2DP_SINK_CMD_PLAY 1
#define A2DP_SINK_CMD_STOP 2
#define A2DP_SINK_CMD_PAUSE 3
#define A2DP_SINK_CMD_FORWARD 4
#define A2DP_SINK_CMD_BACKWARD 5

typedef struct {
  iotjs_jobjectwrap_t jobjectwrap;
  RKBluetooth* bt_handle;
  int bt_status;
} IOTJS_VALIDATED_STRUCT(iotjs_bluetooth_t);

class BluetoothEvent {
 public:
  BluetoothEvent(iotjs_bluetooth_t* handle_) {
    handle = handle_;
  }
  void send(int, int, int, void*);

 public:
  static void OnCallback(uv_async_t*);
  static void AfterCallback(uv_handle_t*);

 private:
  int what;
  int arg1;
  int arg2;
  void* data;
  iotjs_bluetooth_t* handle;
};

static iotjs_bluetooth_t* iotjs_bluetooth_create(const jerry_value_t jbluetooth,
                                                 const jerry_char_t* name);
static void iotjs_bluetooth_destroy(iotjs_bluetooth_t* bluetooth);
static void iotjs_bluetooth_onevent(void* self, int what, int arg1, int arg2,
                                    void* data);

#ifdef __cplusplus
}
#endif /* __cplusplus */
#endif // BLUETOOTH_NATIVE_H
