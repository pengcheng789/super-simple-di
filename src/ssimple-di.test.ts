import { Component, init, getInstance } from './ssimple-di';

@Component
export class A {
  a = 'a';
}

@Component
export class B {
  b = 'b';
  a: A;

  constructor(a: A) {
    this.a = a;
  }
}

init();

const a = getInstance<A>(A);
const b = getInstance<B>(B);

console.log(`a.a = ${a.a}`);
console.log(`b.b = ${b.b}`);
console.log(`b.a.a = ${b.a.a}`);