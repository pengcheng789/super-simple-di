import * as ssimpleDI from '../src/ssimple-di';

test('Get instances from DI container.', () => {
    @ssimpleDI.Component
    class A { a = 'a' }

    @ssimpleDI.Component
    class B { 
        b = 'b';

        constructor(
            private a: A
        ) {}

        getA(): A {
            return this.a;
        }
    }

    @ssimpleDI.Module([
        B,
        A
    ])
    class Module {}

    ssimpleDI.init();
    let a = ssimpleDI.getInstance<A>(A);
    let b = ssimpleDI.getInstance<B>(B);

    expect(a.a).toBe('a');
    expect(b.b).toBe('b');
    expect(b.getA()).toEqual(a);
});