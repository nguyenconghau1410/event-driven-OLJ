import { ToastrModule, ToastrConfig } from "ngx-toastr";

export const toastrConfig: ToastrConfig = {
    positionClass: 'toast-top-right',
    timeOut: 3000,
    progressBar: true,
    enableHtml: true,
    disableTimeOut: false,
    closeButton: false,
    extendedTimeOut: 0,
    progressAnimation: "increasing",
    toastClass: "",
    titleClass: "",
    messageClass: "",
    easing: "",
    easeTime: "",
    tapToDismiss: false,
    onActivateTick: false,
    newestOnTop: false
};

export const ToastrModuleConfig = ToastrModule.forRoot({
    toastConfig,
});