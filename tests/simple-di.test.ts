import * as simpleDI from '../src/simple-di';

test('Get instances from DI container.', () => {
    @simpleDI.Component
    class A { a = 'a' }

    @simpleDI.Component
    class B { 
        b = 'b';

        constructor(
            private a: A
        ) {}

        getA(): A {
            return this.a;
        }
    }

    @simpleDI.Module([
        B,
        A
    ])
    class Module {}

    simpleDI.init();
    let a = simpleDI.getInstance<A>(A);
    let b = simpleDI.getInstance<B>(B);

    expect(a.a).toBe('a');
    expect(b.b).toBe('b');
    expect(b.getA()).toEqual(a);
});