declare module '@paypal/checkout-server-sdk' {
  export namespace core {
    export class PayPalHttpClient {
      constructor(environment: PayPalEnvironment);
      execute(request: any): Promise<any>;
    }

    export class LiveEnvironment {
      constructor(clientId: string, clientSecret: string);
    }

    export class SandboxEnvironment {
      constructor(clientId: string, clientSecret: string);
    }

    export type PayPalEnvironment = LiveEnvironment | SandboxEnvironment;
  }

  export namespace orders {
    export class OrdersCreateRequest {
      prefer(value: string): void;
      requestBody(body: any): void;
    }

    export class OrdersCaptureRequest {
      constructor(orderId: string);
    }

    export class OrdersGetRequest {
      constructor(orderId: string);
    }
  }

  export namespace payments {
    export class CapturesRefundRequest {
      constructor(captureId: string);
      requestBody(body: any): void;
    }
  }
}
