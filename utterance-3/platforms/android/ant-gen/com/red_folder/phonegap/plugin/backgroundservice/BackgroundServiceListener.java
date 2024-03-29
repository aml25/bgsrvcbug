/*
 * This file is auto-generated.  DO NOT MODIFY.
 * Original file: /Users/alaskowi/documents/ndg/fightclub/phonegap/utterance_prototype/utterance-3/platforms/android/src/com/red_folder/phonegap/plugin/backgroundservice/BackgroundServiceListener.aidl
 */
package com.red_folder.phonegap.plugin.backgroundservice;
public interface BackgroundServiceListener extends android.os.IInterface
{
/** Local-side IPC implementation stub class. */
public static abstract class Stub extends android.os.Binder implements com.red_folder.phonegap.plugin.backgroundservice.BackgroundServiceListener
{
private static final java.lang.String DESCRIPTOR = "com.red_folder.phonegap.plugin.backgroundservice.BackgroundServiceListener";
/** Construct the stub at attach it to the interface. */
public Stub()
{
this.attachInterface(this, DESCRIPTOR);
}
/**
 * Cast an IBinder object into an com.red_folder.phonegap.plugin.backgroundservice.BackgroundServiceListener interface,
 * generating a proxy if needed.
 */
public static com.red_folder.phonegap.plugin.backgroundservice.BackgroundServiceListener asInterface(android.os.IBinder obj)
{
if ((obj==null)) {
return null;
}
android.os.IInterface iin = obj.queryLocalInterface(DESCRIPTOR);
if (((iin!=null)&&(iin instanceof com.red_folder.phonegap.plugin.backgroundservice.BackgroundServiceListener))) {
return ((com.red_folder.phonegap.plugin.backgroundservice.BackgroundServiceListener)iin);
}
return new com.red_folder.phonegap.plugin.backgroundservice.BackgroundServiceListener.Stub.Proxy(obj);
}
@Override public android.os.IBinder asBinder()
{
return this;
}
@Override public boolean onTransact(int code, android.os.Parcel data, android.os.Parcel reply, int flags) throws android.os.RemoteException
{
switch (code)
{
case INTERFACE_TRANSACTION:
{
reply.writeString(DESCRIPTOR);
return true;
}
case TRANSACTION_handleUpdate:
{
data.enforceInterface(DESCRIPTOR);
this.handleUpdate();
reply.writeNoException();
return true;
}
case TRANSACTION_getUniqueID:
{
data.enforceInterface(DESCRIPTOR);
java.lang.String _result = this.getUniqueID();
reply.writeNoException();
reply.writeString(_result);
return true;
}
}
return super.onTransact(code, data, reply, flags);
}
private static class Proxy implements com.red_folder.phonegap.plugin.backgroundservice.BackgroundServiceListener
{
private android.os.IBinder mRemote;
Proxy(android.os.IBinder remote)
{
mRemote = remote;
}
@Override public android.os.IBinder asBinder()
{
return mRemote;
}
public java.lang.String getInterfaceDescriptor()
{
return DESCRIPTOR;
}
@Override public void handleUpdate() throws android.os.RemoteException
{
android.os.Parcel _data = android.os.Parcel.obtain();
android.os.Parcel _reply = android.os.Parcel.obtain();
try {
_data.writeInterfaceToken(DESCRIPTOR);
mRemote.transact(Stub.TRANSACTION_handleUpdate, _data, _reply, 0);
_reply.readException();
}
finally {
_reply.recycle();
_data.recycle();
}
}
@Override public java.lang.String getUniqueID() throws android.os.RemoteException
{
android.os.Parcel _data = android.os.Parcel.obtain();
android.os.Parcel _reply = android.os.Parcel.obtain();
java.lang.String _result;
try {
_data.writeInterfaceToken(DESCRIPTOR);
mRemote.transact(Stub.TRANSACTION_getUniqueID, _data, _reply, 0);
_reply.readException();
_result = _reply.readString();
}
finally {
_reply.recycle();
_data.recycle();
}
return _result;
}
}
static final int TRANSACTION_handleUpdate = (android.os.IBinder.FIRST_CALL_TRANSACTION + 0);
static final int TRANSACTION_getUniqueID = (android.os.IBinder.FIRST_CALL_TRANSACTION + 1);
}
public void handleUpdate() throws android.os.RemoteException;
public java.lang.String getUniqueID() throws android.os.RemoteException;
}
