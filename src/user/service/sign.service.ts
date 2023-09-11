import { HttpService } from '../../http/service/impl/http.service'; // 导入HttpService
import { IUserOptions } from '../../types/interface'; // 导入用户选项接口
import { SignApiService } from '../api/signApi.service'; // 导入登录API服务
import * as CryptoJS from 'crypto-js/core'; // 导入CryptoJS库
import 'crypto-js/md5'; // 导入MD5哈希算法

// 抽象类 `SignService`，用于处理签到相关操作
export abstract class SignService {
  protected account: string; // 用户账号
  protected password: string; // 用户密码

  protected abstract indexPageUrl: string; // 抽象属性：首页URL
  protected abstract loginApi: string; // 抽象属性：登录API

  constructor(
    protected readonly httpService: HttpService,
    protected readonly signApiService: SignApiService,
  ) {}

  // 获取用户信息
  getUser() {
    return {
      account: this.account, // 用户账号
      password: this.password, // 用户密码
    };
  }

  // 设置用户信息
  setUser(options: IUserOptions) {
    this.account = options.account; // 设置用户账号
    this.password = options.password; // 设置用户密码
  }

  // 静态方法，用于对密码进行加密处理
  protected static cryptoPassword(pwd_: string) {
    let pwd = CryptoJS.MD5(CryptoJS.enc.Utf8.parse(pwd_)).toString(); // 对密码进行MD5哈希加密
    if (pwd.length > 5) {
      pwd = pwd.substring(0, 5) + 'a' + pwd.substring(5, pwd.length); // 修改加密后的密码
    }
    if (pwd.length > 10) {
      pwd = pwd.substring(0, 10) + 'b' + pwd.substring(10, pwd.length); // 修改加密后的密码
    }
    pwd = pwd.substring(0, pwd.length - 2); // 修改加密后的密码
    return pwd; // 返回加密后的密码
  }

  /**
   * 预请求，先访问一次登录页面
   * @private
   */
  protected preRequest() {
    return this.signApiService.preRequest(this.indexPageUrl); // 发送预请求以访问登录页面
  }

  // 执行登录操作
  async doLogin() {
    const result = await this.signApiService.login(
      this.account, // 用户账号
      SignService.cryptoPassword(this.password), // 加密后的密码
      this.loginApi, // 登录API
    );
    if (!result.error && result.goto2) {
      return true; // 登录成功，返回true
    }
    return result; // 登录失败，返回响应数据
  }

  // 抽象方法，用于执行签到操作
  public abstract doSign(...args: any):
    | {
        message?: string;
        result: boolean;
      }
    | Promise<{
        message?: string;
        result: boolean;
      }>;
}
