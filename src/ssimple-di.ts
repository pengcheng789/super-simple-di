/*
 * Copyright 2019 Pengcheg Cai
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import 'reflect-metadata';
import { getLogger } from 'log4js';

const logger = getLogger('simple-DI');
logger.level = 'info';


/**
 * Bean 容器。
 */
const beanContainer: Record<string, any> = {};

/**
 * 类型容器。
 */
const typeContainer: Record<string, Function> = {};

/**
 * Bean 容器初始化标志位。
 */
let isInit = false;

/**
 * 声明为 Bean 容器托管的装饰器。
 */
export function Component(construct: Function) {
    // @ts-ignore
    typeContainer[construct.name] = construct;
}

/** 
 * 创造 Bean 实例。
 * 
 * @param dependencyChain 依赖链，用以检测是否存在循环依赖。
*/
function createInstance(construct: Function, dependencyChain: Function[] = []): any {
    // @ts-ignore
    let typeName = construct.name;

    // 该类型已实例化，直接在 Bean 中获取。
    if (beanContainer.hasOwnProperty(typeName)) {
        return beanContainer[typeName];
    }

    // 在依赖链中加入自己的类型，用以下一步检测是否存在循环依赖。
    dependencyChain.push(construct);

    let paramBeans = [];
    let paramTypes: Function[] = Reflect.getMetadata("design:paramtypes", construct);

    // 如果构造方法需要引用依赖，则递归创造依赖的实例。
    if (paramTypes) {
        paramTypes.forEach(paramType => {
            // @ts-ignore
            let paramTypeName = paramType.name;
    
            // 引用的依赖已经在依赖链中，导致循环依赖。
            if (paramTypeName in dependencyChain) {
                logger.fatal(`Error creating bean with name ${typeName}: Requested bean is currently in creation.`);
                return undefined;
            }

            // 检测引用的依赖是否已实例化。
            let paramBean = beanContainer[paramTypeName];
            // 如果尚未实例化，则递归创造实例。
            if (!paramBean) {
                // 如果引用的依赖没有检测到，即没有使用`@Component`装饰器修饰，则依赖不存在。
                if (!(paramTypeName in typeContainer)) {
                    logger.fatal(`Error creating bean with name ${typeName}: Requested bean ${paramTypeName} is not found.`);
                    return undefined;
                }
    
                let provider = typeContainer[paramTypeName];
                paramBean = createInstance(provider, dependencyChain);
            }
    
            paramBeans.push(paramBean);
        });
    }

    let bean = new (construct as any)(...paramBeans);
    beanContainer[typeName] = bean;
    logger.info(`Created instance '${typeName}'.`);
    return bean;
}

// Bean 识别声明装饰器。
export function Module(imports: Function[]): Function {
    return () => {
        imports.forEach(type =>
            // @ts-ignore
            logger.info(`Imported component '${type.name}'.`))
    };
}

// Bean 容器初始化。
export function init() {
    Object.keys(typeContainer).forEach(type => {
        if (!(type in beanContainer)) {
            createInstance(typeContainer[type]);
        }
    });
    isInit = true;
}


// 从 Bean 容器中获取实例。
export function getInstance<T>(type: { new (...args: any[]): T }): T {
    if (!isInit) {
        logger.fatal(`The container is not initialize. Please call init() before getting instances.`);
        return undefined;
    }

    // @ts-ignore
    let typeName = type.name;
    if (!(typeName in beanContainer)) {
        logger.error(`Get instance failure: Not found instance of '${typeName}'.`);
        return undefined;
    }

    return beanContainer[typeName] as T;
}
