import { Global, Module } from '@nestjs/common'; // 导入NestJS的Global装饰器和Module装饰器
import { HttpService } from './service/impl/http.service'; // 导入自定义的HttpService
import { UtilService } from './service/impl/util.service'; // 导入自定义的UtilService

@Global() // 使用Global装饰器，将该模块标记为全局模块，可以在整个应用程序中访问其提供的服务
@Module({
  providers: [HttpService, UtilService], // 声明该模块提供的服务，包括HttpService和UtilService
  exports: [HttpService, UtilService], // 声明该模块导出的服务，以便其他模块可以访问它们
})
export class HttpModule {}


/*这段代码定义了一个名为HttpModule的NestJS模块。该模块使用了@Global()装饰器，因此它是一个全局模块，
可以在整个应用程序中访问其提供的服务。模块提供了HttpService和UtilService两个服务
，并将它们导出以便其他模块可以引用和使用它们。这个模块的目的是将HttpService和UtilService注册为全局可用的服务，
以便它们可以在整个应用程序中被注入到其他组件中。*/