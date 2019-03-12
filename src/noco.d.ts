interface IinvokeSectionMethodParams {
    name?: String
    ref?: String
    method?: String
    params?: String
}

interface IdataSourceParams {
    api: String
    params?: any
}

interface IupdateRouterViewParams {
    ancestorPage?: String
    page?: String
    litOptions?: any
    outerLitOptions?: any
}

interface IinvokePageMethodParams {
    ancestorPage?: String
    ref?: String
    metho?: String
    params?: String
}

interface IgotoRouteParams {
    page?: String
    litOptions?: String
}

interface InewTabParams {
    page?: String
    litOptions?: String
}

interface IhideSectionParams {
    name: String
}

interface IshowSectionParams {
    name: String
}

interface ItoggleSectionParams {
    name: String
}

interface IreloadSectionParams {
    name: String
}

interface ImessageParams{
    type?:String
    content?:any
}

interface InoticeParams{
    title?:String
    desc?:String
    render?:(h:any)=>void
    duration?:Number
    onClose?:()=>void
}

interface IlitActions {
    dataSource: (dataSourceParams: IdataSourceParams) => void
    invokeSectionMethod: (invokeSectionMethodParams: IinvokeSectionMethodParams) => void
    updateRouterView: (updateRouterViewParams: IupdateRouterViewParams) => void
    invokePageMethod: (invokePageMethodParams: IinvokePageMethodParams) => void
    gotoRoute: (gotoRouteParams: IgotoRouteParams) => void
    newTab: (newTabParams: InewTabParams) => void
    hideSection: (hideSectionParams: IhideSectionParams) => void
    showSection: (showSectionParams: IshowSectionParams) => void
    toggleSection: (toggleSectionParams: ItoggleSectionParams) => void
    reloadSection: (reloadSectionParams: IreloadSectionParams) => void
    message: (messageParams: ImessageParams) => void
    notice: (noticeParams: InoticeParams) => void
}

interface Ivm {
    litActions: IlitActions
    litOptions: {}
}

interface IAppConfig {
    default?: { page?: String, litOptions?: any }
    api?: any
    pages?:any
}

interface ILit {
    registerApp: (appConfig: IAppConfig) => void
    showLoading: () => void
    hideLoading: () => void
    setHeaders: (obj:any) => void
}

declare var vm: Ivm;

declare var Lit: ILit;

declare var Vue;
