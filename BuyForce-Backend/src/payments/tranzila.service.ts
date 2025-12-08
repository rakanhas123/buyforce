import axios from 'axios';

export default class TranzilaService {
  private endpoint = 'https://secure5.tranzila.com/cgi-bin/tranzila31.cgi';

  private extract(field: string, data: string) {
    const match = data.match(new RegExp(`${field}=([^&]+)`));
    return match ? match[1] : null;
  }

  private parseResponse(raw: string) {
    return {
      raw,
      response: this.extract('Response', raw),
      index: this.extract('Index', raw),
      errorCode: this.extract('Err', raw),
      errorText: this.extract('ErrorText', raw),
    };
  }

  async preAuth(tokenRef: string, amount = 1) {
    const params = new URLSearchParams({
      supplier: process.env.TRANZILA_SUPPLIER!,
      TranzilaPW: process.env.TRANZILA_PASSWORD!,
      TranzilaTK: tokenRef,
      sum: amount.toString(),
      currency: '1',
      action: 'preauth',
    });

    const res = await axios.post(this.endpoint, params);
    const parsed = this.parseResponse(res.data);

    if (parsed.response !== '000') {
      throw new Error(parsed.errorText || 'PREAUTH_FAILED');
    }

    return {
      providerRef: parsed.index,
      raw: parsed.raw,
    };
  }

  async charge(tokenRef: string, amount: number) {
    const params = new URLSearchParams({
      supplier: process.env.TRANZILA_SUPPLIER!,
      TranzilaPW: process.env.TRANZILA_PASSWORD!,
      TranzilaTK: tokenRef,
      sum: amount.toString(),
      currency: '1',
      action: 'charge',
    });

    const res = await axios.post(this.endpoint, params);
    const parsed = this.parseResponse(res.data);

    if (parsed.response !== '000') {
      throw new Error(parsed.errorText || 'CHARGE_FAILED');
    }

    return {
      providerRef: parsed.index,
      raw: parsed.raw,
    };
  }

  async refund(providerRef: string, amount: number) {
    const params = new URLSearchParams({
      supplier: process.env.TRANZILA_SUPPLIER!,
      TranzilaPW: process.env.TRANZILA_PASSWORD!,
      TranzilaIndex: providerRef,
      sum: amount.toString(),
      action: 'refund',
    });

    const res = await axios.post(this.endpoint, params);
    const parsed = this.parseResponse(res.data);

    if (parsed.response !== '000') {
      throw new Error(parsed.errorText || 'REFUND_FAILED');
    }

    return {
      success: true,
      raw: parsed.raw,
    };
  }
}
