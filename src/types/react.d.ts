declare module 'react' {
  export interface ReactElement<
    P = any,
    T extends string | JSXElementConstructor<any> =
      | string
      | JSXElementConstructor<any>
  > {
    type: T;
    props: P;
    key: Key | null;
  }

  export type JSXElementConstructor<P> =
    | ((props: P) => ReactElement<any, any> | null)
    | (new (props: P) => Component<any, any>);

  export interface RefObject<T> {
    readonly current: T | null;
  }

  export type Key = string | number;

  export type ReactText = string | number;
  export type ReactChild = ReactElement | ReactText;
  export type ReactNode = ReactChild | boolean | null | undefined;

  export interface ComponentClass<P = {}, S = ComponentState>
    extends StaticLifecycle<P, S> {
    new (props: P, context?: any): Component<P, S>;
    propTypes?: WeakValidationMap<P> | undefined;
    contextType?: Context<any> | undefined;
    contextTypes?: ValidationMap<any> | undefined;
    childContextTypes?: ValidationMap<any> | undefined;
    defaultProps?: Partial<P> | undefined;
    displayName?: string | undefined;
  }

  export interface FunctionComponent<P = {}> {
    (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;
    propTypes?: WeakValidationMap<P> | undefined;
    contextTypes?: ValidationMap<any> | undefined;
    defaultProps?: Partial<P> | undefined;
    displayName?: string | undefined;
  }

  export type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;

  export interface Component<P = {}, S = {}, SS = any>
    extends ComponentLifecycle<P, S, SS> {}

  export interface ComponentState {}

  export interface ComponentLifecycle<P, S, SS = any> {}

  export interface StaticLifecycle<P, S> {}

  export interface PropsWithChildren<P> {
    children?: ReactNode | undefined;
  }

  export interface Context<T> {}

  export type ValidationMap<T> = {
    [K in keyof T]?: Validator<T[K]> | undefined;
  };
  export type WeakValidationMap<T> = {
    [K in keyof T]?: WeakValidator<T[K]> | undefined;
  };
  export type Validator<T> = any;
  export type WeakValidator<T> = any;

  export function useState<S>(
    initialState: S | (() => S)
  ): [S, Dispatch<SetStateAction<S>>];
  export function useState<S = undefined>(): [
    S | undefined,
    Dispatch<SetStateAction<S | undefined>>
  ];

  export type SetStateAction<S> = S | ((prevState: S) => S);
  export type Dispatch<A> = (value: A) => void;

  export function useEffect(
    effect: EffectCallback,
    deps?: DependencyList
  ): void;
  export function useRef<T>(initialValue: T): MutableRefObject<T>;
  export function useRef<T>(initialValue: T | null): RefObject<T>;
  export function useRef<T = undefined>(): MutableRefObject<T | undefined>;

  export interface MutableRefObject<T> {
    current: T;
  }

  export type EffectCallback = () => void | (() => void | undefined);
  export type DependencyList = ReadonlyArray<any>;

  export function createElement<P extends {}>(
    type: FunctionComponent<P> | ComponentClass<P> | string,
    props?: P | null,
    ...children: ReactNode[]
  ): ReactElement<P>;

  export interface Attributes {
    key?: Key | null | undefined;
  }

  export interface ClassAttributes<T> extends Attributes {
    ref?: Ref<T> | undefined;
  }

  export type Ref<T> = ((instance: T | null) => void) | RefObject<T> | null;

  export interface SyntheticEvent<T = Element, E = Event> {
    bubbles: boolean;
    cancelable: boolean;
    currentTarget: T;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    nativeEvent: E;
    preventDefault(): void;
    stopPropagation(): void;
    target: EventTarget;
    timeStamp: number;
    type: string;
  }

  export interface ChangeEvent<T = Element> extends SyntheticEvent<T, Event> {
    target: EventTarget & T;
  }

  export interface FormEvent<T = Element> extends SyntheticEvent<T, Event> {
    target: EventTarget & T;
  }
}

declare namespace JSX {
  interface Element extends React.ReactElement<any, any> {}
  interface ElementClass extends React.Component<any> {}
  interface ElementAttributesProperty {
    props: {};
  }
  interface ElementChildrenAttribute {
    children: {};
  }

  interface IntrinsicAttributes extends React.Attributes {}
  interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> {}

  interface IntrinsicElements {
    // HTML
    a: any;
    abbr: any;
    address: any;
    area: any;
    article: any;
    aside: any;
    audio: any;
    b: any;
    base: any;
    bdi: any;
    bdo: any;
    big: any;
    blockquote: any;
    body: any;
    br: any;
    button: any;
    canvas: any;
    caption: any;
    cite: any;
    code: any;
    col: any;
    colgroup: any;
    data: any;
    datalist: any;
    dd: any;
    del: any;
    details: any;
    dfn: any;
    dialog: any;
    div: any;
    dl: any;
    dt: any;
    em: any;
    embed: any;
    fieldset: any;
    figcaption: any;
    figure: any;
    footer: any;
    form: any;
    h1: any;
    h2: any;
    h3: any;
    h4: any;
    h5: any;
    h6: any;
    head: any;
    header: any;
    hgroup: any;
    hr: any;
    html: any;
    i: any;
    iframe: any;
    img: any;
    input: any;
    ins: any;
    kbd: any;
    keygen: any;
    label: any;
    legend: any;
    li: any;
    link: any;
    main: any;
    map: any;
    mark: any;
    menu: any;
    menuitem: any;
    meta: any;
    meter: any;
    nav: any;
    noscript: any;
    object: any;
    ol: any;
    optgroup: any;
    option: any;
    output: any;
    p: any;
    param: any;
    picture: any;
    pre: any;
    progress: any;
    q: any;
    rp: any;
    rt: any;
    ruby: any;
    s: any;
    samp: any;
    script: any;
    section: any;
    select: any;
    small: any;
    source: any;
    span: any;
    strong: any;
    style: any;
    sub: any;
    summary: any;
    sup: any;
    table: any;
    tbody: any;
    td: any;
    textarea: any;
    tfoot: any;
    th: any;
    thead: any;
    time: any;
    title: any;
    tr: any;
    track: any;
    u: any;
    ul: any;
    var: any;
    video: any;
    wbr: any;
  }
}
