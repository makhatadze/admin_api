import { Injectable } from '@nestjs/common';
import * as superagent from 'superagent';

@Injectable()
export class IpToAddressService {
  public async IpToAddress(ip: string): Promise<string | null> {
    if (ip === '::1') {
      return 'Development environment operation';
    }
    try {
      const responseText = await superagent
        .get('https://apis.map.qq.com/ws/location/v1/ip')
        .query({ ip })
        .query({ output: 'json' })
        .query({ key: process.env.TENCENT_MAP_KEY });
      const {
        status,
        // eslint-disable-next-line
        result: { ad_info },
      } = JSON.parse(responseText.text) || {};
      if (status == 0) {
        // eslint-disable-next-line
        const { province, city, district } = ad_info;
        return `${province}${city}${district}`;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e, 'Geocoding error');
      throw new Error(`${ip}Geocoding error`);
    }
  }
}
