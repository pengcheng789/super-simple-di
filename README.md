# Super Simple DI

## 简介

一个简单的依赖注入工具，用于[Typescript](https://www.typescriptlang.org/)和[Node.js](https://nodejs.org/zh-cn/)平台。

## 用法

* 安装依赖

  如果使用的是`yarn`，在命令行输入

  ```shell
  > yarn add super-simple-di
  ```

  如果使用的是`npm`，在命令行输入

  ```shell
  > npm -i super-simple-di
  ```

* 导入模块

  使用`import`语句进行导入。

  ```typescript
  import * as ssimpleDI from 'simple-di';
  ```

* 声明 Bean

  使用`Component`装饰器声明需要注入成为 Bean 的组件。

  ``` typescript
  @ssimpleDI.Component
  class A {
      // 省略该类的代码
  }
  ```

* 导入 Bean 并初始化

  在 Nodejs 应用入口里使用`Module`装饰器导入前面声明的 Bean ，并调用`init()`方法进行初始化。

  ```typescript
  // 省略导入的模块

  @ssimpleDI.Module([
      A,
      // 省略其它 Bean
  ])
  class Module {}

  ssimpleDI.init()

  // 省略其它的代码
  ```

* 使用`getInstance()`方法从 Bean 容器中获取实例

  ```typescript
  // ...

  let a = ssimpleDI.getInstance<A>(A);

  // ...
  ```

## 实例

* 目录结构
  
  ```shell
  .
  ├─dist
  ├─src
  │  ├─a.ts
  │  ├─b.ts
  │  └─main.ts
  └─others
  ```

* 文件内容

  ```typescript
  // file: a.ts

  import * as ssimpleDI from 'simple-di';

  @ssimpleDi.Component
  export class A {
      a = 'a';
  }
  ```

  ```typescript
  // file: b.ts

  import * as ssimpleDI from 'ssimple-di';
  import { A } from './a.ts';

  @ssimpleDi.Component
  export class B {
      b = 'b';

      constructor(private a: A) {}

      getA(): A {
          return this.a;
      }
  }
  ```

  ```typescript
  // file: main.ts

  import { strict as assert } from 'assert';
  import * as ssimpleDI from 'ssimple-di';
  import { A } from './a.ts';
  import { B } from './b.ts';

  @ssimpleDI.Module([
      B,
      A
  ])
  export class Module {}

  ssimpleDI.init();

  let a = ssimpleDI.getInstance<A>(A);
  let b = ssimpleDI.getInstance<B>(B);

  assert.strictEqual(a.a, 'a');  // OK
  assert.strictEqual(b.b, 'b');  // OK
  assert.deepStrictEqual(b.getA(), a);  // OK
  ```
