/*这段代码定义了一个名为HttpService的类，用于创建并提供一个配置了自定义User-Agent和Cookie处理的Axios实例。该类使用NestJS的@Injectable()装饰器，
因此可以被注入到其他NestJS组件中，以便在应用程序中使用这个自定义的Axios实例来进行HTTP请求。*/

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'; // 导入axios库及相关类型
import { wrapper } from 'axios-cookiejar-support'; // 导入axios-cookiejar-support中的wrapper函数
import { CookieJar } from 'tough-cookie'; // 导入tough-cookie库中的CookieJar类型
import { Injectable } from '@nestjs/common'; // 导入nestjs中的Injectable装饰器

@Injectable() // 使用NestJS的Injectable装饰器，将该类标记为一个可注入的服务
export class HttpService {
  private readonly axios: AxiosInstance; // 声明一个只读的axios实例
  private readonly jar: InstanceType<typeof CookieJar>; // 声明一个只读的CookieJar实例

  constructor() {
    this.jar = new CookieJar(); // 创建一个CookieJar实例，用于处理Cookie
    this.axios = wrapper(
      axios.create({
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36 Edg/104.0.5112.102', // 设置User-Agent头部信息
          'X-Requested-With': 'XMLHttpRequest', // 设置X-Requested-With头部信息
        },
        jar: this.jar, // 将CookieJar实例传递给axios实例，用于自动处理Cookie
        timeout: 10 * 1000, // 设置请求超时时间为10秒
      }),
    );
  }

  // 获取axios实例的方法
  getInstance() {
    return this.axios;
  }
}
