import { VITE_BACKEND_URL } from '@configuration';
import axios, { AxiosError } from 'axios';
import EventEmitter from 'events';

const isServerUnavailableError = (error: unknown) => {
    return error instanceof AxiosError && error.code === 'ERR_NETWORK';
};

class ApiHealth {
    private backendRefusedConnection: boolean | null = null;
    private emitter = new EventEmitter();
    private checkNeeded = true;
    private checkIntervalPtr: NodeJS.Timeout | null = null;
    private checkIntervalTime = 1000 * 60 * 5; // 5 minutes

    eventTypes = {
        BACKEND_STATUS_CHANGED: 'BACKEND_STATUS_CHANGED',
    };

    constructor() {
        this.addHealthCheckInterval();
    }

    public handleBackendRefusedConnection = () => {
        this.backendRefusedConnection = true;
        this.emitter.emit(this.eventTypes.BACKEND_STATUS_CHANGED, this.backendRefusedConnection);
        this.addHealthCheckInterval();
    };

    public isBackendUnavailable = (): boolean | null => {
        if (this.backendRefusedConnection === null) {
            return null;
        } else {
            return this.backendRefusedConnection;
        }
    };

    public onBackendStatusChange = (callback: (status: boolean) => void) => {
        this.emitter.on(this.eventTypes.BACKEND_STATUS_CHANGED, callback);
        return () => {
            this.emitter.off(this.eventTypes.BACKEND_STATUS_CHANGED, callback);
        };
    };

    private healthCheck = async () => {
        console.log("Checking backend's health");
        if (!this.checkNeeded) {
            this.removeHealthCheckInterval();
        }
        try {
            await axios.get(`${VITE_BACKEND_URL}/health`);
        } catch (error) {
            if (isServerUnavailableError(error)) {
                this.backendRefusedConnection = true;
                this.emitter.emit(this.eventTypes.BACKEND_STATUS_CHANGED, true);
                return;
            }
        }
        this.removeHealthCheckInterval();
        this.backendRefusedConnection = false;
        this.emitter.emit(this.eventTypes.BACKEND_STATUS_CHANGED, false);
    };

    private removeHealthCheckInterval = () => {
        if (this.checkIntervalPtr) {
            clearInterval(this.checkIntervalPtr);
        }
    };

    private addHealthCheckInterval = () => {
        if (this.backendRefusedConnection === null) {
            this.healthCheck().then();
        } else {
            if (this.checkIntervalPtr) {
                clearInterval(this.checkIntervalPtr);
            }
            this.checkIntervalPtr = setInterval(() => {
                this.healthCheck().then();
            }, this.checkIntervalTime);
        }
    };
}

export { isServerUnavailableError };
export default new ApiHealth();
