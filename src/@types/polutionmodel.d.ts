export type Polution = {
    title: string,
    CARBON_MONOXIDE_PPM: string,
    NITROGEN_DIOXIDE_PPM: string,
    OZONE_PPM: string,
    PM10_UG_M3: string,
    PM25_UG_M3: string,
    SULFUR_DIOXIDE_PPB: string
}

export type PolutionModelProps = {
    open: boolean;
    onHandleClose: () => void;
    data: any ;
};

export type PolutionTableModelProps = {
    data: any ;
};