import { Component, OnInit, ViewChild } from "@angular/core";
import { SolicitudCompraService } from "../../services/solicitudcompra.service";
import { AuthServices } from "../../services/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSelect } from "@angular/material/select";
import { MatDialog } from "@angular/material/dialog";
import { DialogInfoComponent } from "../dialog-info/dialog-info.component";

//import * as nodemailer from 'nodemailer';
import { Empresa } from "../../shared/models/empresa.model";
import { CentroCostos } from "../../shared/models/centrocostos.model";
import { CuentaMayor } from "../../shared/models/cuentamayor.model";
import { SucursalPlaza } from "../../shared/models/sucursalplaza.model";
import { Imputacion } from "../../shared/models/imputacion.model";
import { Posiciones } from "../../shared/models/posiciones.model";
import { Almacen } from "../../shared/models/almacen.model";
import { Activo } from "../../shared/models/activo.model";
import { Necesidad } from "../../shared/models/necesidad.model";
import { GrupoArticulo } from "../../shared/models/grupoarticulo.model";
import { GrupoCompra } from "../../shared/models/grupocompra.model";
import { Area } from "../../shared/models/areas.model";
import { Solicitud } from "../../shared/models/solicitud.model";
import { Producto } from "../../shared/models/producto.model";
import { ProductoHijos } from "../../shared/models/productHijos.model";
import { Materiales } from "../../shared/models/materiales.model";
import { User } from "../../shared/models/user.model";
import { OrdenInterna } from "../../shared/models/ordeninterna.model";
import { UnidadMedida } from "../../shared/models/umedida.model";
import { Moneda } from "../../shared/models/moneda.model";
import { Categorias } from "client/app/shared/models/categorias.model";
//importamos el modelo con el que se empalmara el json de la consulta de el webservice

import { MensajesSolPed } from "../../shared/models/mensajessolped.model";

//import { error, callbackify } from 'util';
import { DataSolicitudCompra } from "../../shared/models/dataSolicitudCompra.model";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  FormsModule,
} from "@angular/forms";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { ToastComponent } from "../../shared/toast/toast.component";
import { TouchSequence } from "selenium-webdriver";
import { FileUploader } from "ng2-file-upload";
import { formatCurrency, getCurrencySymbol } from "@angular/common";
import { ReplaySubject, Subject, throwError } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { MatPaginatorIntl, PageEvent } from "@angular/material/paginator";

//importacion de ngx-soap para hacer peticiones a SERVICIOS SOAP para SAP
import {
  NgxSoapService,
  Client,
  ISoapMethodResponse,
  WSSecurity,
  security,
} from "ngx-soap";

import { NgxXml2jsonService } from "ngx-xml2json";


//import { ConsoleReporter } from 'jasmine';

const URL = "/api/upload/singlefile";

@Component({
  selector: "app-listado-solicitudes",
  templateUrl: "./listado-solicitudes.component.html",
  styleUrls: ["./listado-solicitudes.component.css"],
})
export class ListadoSolicitudesComponent implements OnInit {
  public uploader: FileUploader; //definicion de alias a itempara que se detecte en xpress

  // Variables para hacer filtrado de la Empresa
  /** list of banks */
  protected ListEmpresa: Empresa[];
  /** control for the selected bank */
  public EmpresaCtrl: FormControl = new FormControl();
  /** control for the MatSelect filter keyword */
  public EmpreFilterCtrl: FormControl = new FormControl();
  /** list of banks filtered by search keyword */
  public filteredEmpresa: ReplaySubject<Empresa[]> = new ReplaySubject<Empresa[]>(1);
  //fin filtrado empresa

  //variabkles para hacer filtrado de Sucursal
  protected ListSucuPlaza: SucursalPlaza[];
  /** control for the selected bank */
  public SucursalCtrl: FormControl = new FormControl();
  /** control for the MatSelect filter keyword */
  public SucursalFilterCtrl: FormControl = new FormControl();
  /** list of banks filtered by search keyword */
  public filteredSucursal: ReplaySubject<SucursalPlaza[]> = new ReplaySubject<
    SucursalPlaza[]
  >(1);
  //fin de las variables

  //variables para Hacer Bsuqeudas en Select de Centro de Costos
  protected ListCCostos: CentroCostos[];
  public CCostosCrtl: FormControl = new FormControl();
  public CCosotosFilterCtrl: FormControl = new FormControl();
  public filteredCCostos: ReplaySubject<CentroCostos[]> = new ReplaySubject<
    CentroCostos[]
  >(1);
  //public filterCCostosName: ReplaySubject<CentroCostos[]> = new ReplaySubject<CentroCostos[]>(1);
  //fin de variables

  //variables para hacer busquedas por Almacen
  protected ListAlmacen: Almacen[];
  public AlmacenCrtl: FormControl = new FormControl();
  public AlmacenFilterCtrl: FormControl = new FormControl();
  public filteredAlmacen: ReplaySubject<Almacen[]> = new ReplaySubject<
    Almacen[]
  >(1);
  //fin de variables

  //variable spara hacer busqueda de Material o Servicio
  protected ListMateriales: Materiales[];
  public MaterialesCtrl: FormControl = new FormControl();
  public MaterialesFilterCtrl: FormControl = new FormControl();
  public filteredMaterial: ReplaySubject<Materiales[]> = new ReplaySubject<
    Materiales[]
  >(1);
  //fin de variables material o servicio

  //variables para hacer busqueda en select de la Cuenta de Mayor
  protected ListCmayor: CuentaMayor[];
  public CMayorCtrl: FormControl = new FormControl();
  public CMayorFilterCtrl: FormControl = new FormControl();
  public filteredCMayor: ReplaySubject<CuentaMayor[]> = new ReplaySubject<
    CuentaMayor[]
  >(1);
  //fin de las variables

  //varibales para hacer busquedas en Grupo de COmpras
  protected ListGrupoCompra: GrupoCompra[];
  public GCompraCtrl: FormControl = new FormControl();
  public GCompraFilterCtrl: FormControl = new FormControl();
  public filteredGCompra: ReplaySubject<GrupoCompra[]> = new ReplaySubject<
    GrupoCompra[]
  >(1);
  //fin de varibales

  //variables para hacer busqueda en select de unidadesde medida
  protected ListUnidadMedida: UnidadMedida[];
  public UnidadMedidaCtrl: FormControl = new FormControl();
  public UnidadMedidaFilterCtrl: FormControl = new FormControl();
  public filteredUnidadMedida: ReplaySubject<
    UnidadMedida[]
  > = new ReplaySubject<UnidadMedida[]>(1);
  //fin de variables

  //variables para hacer busquedas en Numero de Activo
  protected ListActivo: Activo[];
  public ActivoCrtl: FormControl = new FormControl();
  public ActivoFilterCtrl: FormControl = new FormControl();
  public filteredActivo: ReplaySubject<Activo[]> = new ReplaySubject<Activo[]>(
    1
  );
  //fin de variables

  //variables para hacer busquedas en Orden Estadistica
  protected ListOrdEstadistica: OrdenInterna[];
  public OrdenEstadisticaCrtl: FormControl = new FormControl();
  public OrdenEstadisticaFilterCtrl: FormControl = new FormControl();
  public filteredOrdenEstadistica: ReplaySubject<
    OrdenInterna[]
  > = new ReplaySubject<OrdenInterna[]>(1);
  //fin de las variables

  protected _onDestroy = new Subject<void>();

  constructor(
    private solicitudComp: SolicitudCompraService,
    private _formBuilder: FormBuilder,
    public toast: ToastComponent,
    private auth: AuthServices,
    private soap: NgxSoapService,
    private ngxXml2jsonService: NgxXml2jsonService,
    private snackbar: MatSnackBar,
    private paginator: MatPaginatorIntl,
    public dialog: MatDialog
  ) {}

  numberToLetters: any;
  isLoading: boolean = false;
  DataInsert: Solicitud | undefined;

  //Datos de Plantilla de Sol Pedido
  //pruebas con modelo para pasar informacion desde webservice
  //ListaWD:WebSer[];
  ListaMensajesInsertSoliWS: MensajesSolPed[];
  Mensaje: string;

  //ListEmpresa:Empresa[];
  //ListFilteredEmpresa:ReplaySubject<Empresa[]>;
  SelectEmpresa: Empresa;
  SelectedCostos: CentroCostos;
  SelectedPlaza: SucursalPlaza;
  SelectedCMayor: CuentaMayor;
  SelectedOInvercion: OrdenInterna;
  SelectOrdenEstadisitica: OrdenInterna = new OrdenInterna();

  ListOrdenInterna: OrdenInterna[];
  ListAreas: Area[];
  SelectArea: Area | undefined;
  ListUser: User[];
  ListMoneda: Moneda[];
  ListCategorias: Categorias[];
  //Campos que se bloaquearan dependiendo de la seleccion de Imputacion
  AplicaCenCost: boolean = false;
  AplicaOrdInt: boolean = false;
  AplicaCtaMayor: boolean = false;
  AplicaMat: boolean = false;
  AplicaAlma: boolean = false;
  AplicaUMedida: boolean = false;
  //AplicaCentro:boolean = false;
  AplicaNumActivo: boolean = false;
  AplicaUsobien: boolean = false;
  //bloqueo de campos generales si es que ya existe un Material o Servicio
  BloqMoreItem: boolean = false;

  UMedida: UnidadMedida = new UnidadMedida();

  fecha: string;
  Date = new FormControl(new Date().toISOString());
  date: String;
  usr = new FormControl("", [Validators.required]);
  puesto = new FormControl("", [Validators.required]);
  email = new FormControl("", [Validators.required, Validators.email]);
  tel = new FormControl("", [Validators.required]);
  ext = new FormControl("", [Validators.required, Validators.maxLength(4)]);
  area = new FormControl("", [Validators.required]);
  nombreProduccion = new FormControl();
  //tipo = new FormControl('',[Validators.required])

  //Datos generales
  ListImputacion: Imputacion[];
  ListImputacionForItem: Imputacion[];
  ListPosicion: Posiciones[];
  ListGrupoArticulo: GrupoArticulo[];
  //ListGrupoCompra:GrupoCompra[];
  //ListAlmacen:Almacen[];
  //ListActivo:Activo[];
  ListNecesidad: Necesidad[];
  //ListMateriales:Materiales[];
  //ListUnidadMedida:UnidadMedida[];

  Producto: Producto = new Producto();

  addProdForm: FormGroup;
  // Imputacion = new FormControl('');
  // Posicion = new FormControl('');
  // Tipo = new FormControl('');
  // CentroCostos = new FormControl('');
  // Ordeninterna = new FormControl('');
  // CuentaMayo = new FormControl('');
  Precio = new FormControl(1, Validators.required);
  Almacen = new FormControl(null);
  AlmacenName = new FormControl("");
  Material = new FormControl(null, Validators.required);
  MaterialName = new FormControl("");
  Cantidad = new FormControl(0, Validators.required);

  Centro = new FormControl("");
  //GrupArticulo = new FormControl ('');
  GrupCompra = new FormControl("");
  GrupoCompraName = new FormControl("");
  NumActivo = new FormControl(null);
  NameActivo = new FormControl("");
  NumNeces = new FormControl(0);
  NameNeces = new FormControl("");
  UnidadMedida = new FormControl(0, Validators.required);
  UnidadMedidaName = new FormControl("");
  Espf = new FormControl("", Validators.required);
  UsoProd = new FormControl("", Validators.required);
  //TextBreve = new FormControl ('', Validators.required);
  precio = new FormControl("", [Validators.required]);

  //variable para precio formateado
  price: string = "0";

  //solpedforitem:boolean;
  isEnviadoSolPed: boolean = true;
  //valor para ocultar el Tipo e Orden Estadistica hatza que se seleccioneel tipo de SolPed G -Produccion
  isProduction: boolean = false;
  //variable para mostrar boton de agregar subhijos en la lista
  isAddHijos: boolean = false;
  //validando las autorizaciones
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  //bloqueamos los campos de cantidad y precio para el tipo de solicitud Servicios 4 y producciones 7
  isbloqued: boolean = false;
  ListaData: string[];
  SolPedView: boolean = true;

  UsrAuthEmail: User;
  IdSoliforFile: Solicitud;

  /*------------------------------------variables de hijos-------------------------------------*/
  AddDataProduct: boolean = false;
  Childs: ProductoHijos[] = [];
  ChildsProduct: ProductoHijos = new ProductoHijos();
  textServicio: string = "";
  //variable para guardar el precio por Hijo
  priceChild: string = "";
  posicionPadre: number = 0;
  NoMoreData: boolean = false;
  disabledforchild: boolean = false;
  SelectedOrEstChild: OrdenInterna = new OrdenInterna();
  SelectedOrdenEstaHijo: OrdenInterna;
  SelectedCostosChild: CentroCostos = new CentroCostos();
  SelectCentroCostosHijo: CentroCostos;
  SelectedCMayorChild: CuentaMayor = new CuentaMayor();
  SelectedCMayorHijo: CuentaMayor;
  SelectedUMedidaChild: UnidadMedida = new UnidadMedida();
  /*-------------------------------fin de variables de hijos----------------------------*/

  ngOnInit() {
    //console.log("entrando a validar la conyraseña para SAP ");
    this.PassSOAPSAP();
    //console.log(encodeURI("http://solicitud.adgimm.com.mx:3000/public/63 GRUPOIMAGEN- Cursos Microsoft SQ Y C#.pdf"));
    this.paginator.itemsPerPageLabel = "REGISTROS POR PAGINA";
    //this.uploader.destroy;
    //var fecha = new Date();
    //console.log("Esta es la feeeeeeeeee" + fecha.toISOString().substring(0,10));
    //this.Date = new FormControl(fecha);
    //console.log("-------------------------------------------------------------->"+fecha.toISOString().substring(0,10));

    //this.date = fecha.toISOString().substring(0,10);
    this.selectedFecha();

    this.numberToLetters = require("number-2-letters");
    this.numberToLetters.defaults.lang = "es";
    this.DataInsert = new Solicitud();

    //this.ConectingWebServiceTMP();
    this.getAllEmpre();
    this.getAllMoendas();
    this.getAllArea(this.auth.currentUser.IdUsuario);
    //this.getAllCentroCosto();
    //this.getAllCuentasMayor();
    this.getAllImputaciones();
    //this.getAllPosiciones();
    //this.getAllGrupoArticulo();
    //this.getAllGrupoCompra();
    //this.getAllMateriales();
    //this.getAllAlmacen();
    //this.getAllActivo();
    this.getAllNecesidad();
    this.getAllCategorias();
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ["", Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ["", Validators.required],
    });

    if (this.auth.loggedIn) {
      if (this.auth.isDirArea || this.auth.isAdmin) {
        this.isLoading = true;
      } else {
        this.isLoading = false;
      }
    }

    this.addProdForm = this._formBuilder.group({
      // Imputacion: this.Imputacion,
      // Posicion: this.Posicion,
      // Tipo: this.Tipo,
      // CentroCostos: this.CentroCostos,
      // Ordeninterna: this.Ordeninterna,
      // CuentaMayor: this.CuentaMayo,
      Cantidad: this.Cantidad,
      Precio: this.Precio,
      Material: this.Material,
      MaterialName: this.MaterialName,
      UnidadMedida: this.UnidadMedida,
      NameUnidadMedida: this.UnidadMedidaName,
      Almacen: this.Almacen,
      NameAlmacen: this.AlmacenName,
      Centro: this.Centro,
      //GrupArticulo: this.GrupArticulo,
      GrupCompra: this.GrupCompra,
      GrupoCompraName: this.GrupoCompraName,
      NumActivo: this.NumActivo,
      NameActivo: this.NameActivo,
      NumNeces: this.NumNeces,
      NameNeces: this.NameNeces,
      Espf: this.Espf,
      UsoProd: this.UsoProd,
      //TextBreve: this.TextBreve
    });

    this.uploader = new FileUploader({ url: URL, itemAlias: " " });

    this.uploader.progress = 0;
    //console.log(this.uploader);
    //opciones cuando el archivo este completo y se suba
    this.uploader.onAfterAddingFile = (file) => {
      //console.log("***************Se dejo el archivo*************************");
      //console.log(file);
      file.withCredentials = false;
    };

    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      //console.log(headers);
      //console.log(item);
      //console.log(status);
      // console.log("ImageUpload:uploaded:", item, status, response);
      // console.log("este es el item enviado-->" + item);
      // console.log("este es el status-->" + status);
      // console.log("este es el response-->" + response);
      this.uploader.cancelAll();
      this.uploader.clearQueue();
      // alert('File uploaded successfully');
    };
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  uploadfile() {
    this.uploader.uploadAll();
  }

  //Metodo para recuperar Web Service desde un Servicio de Angular
  PassSOAPSAP() {
    //metodo que convierte la contraseña dada por sap para pasarla a node y poder recuperar la informacion
    //var buf = btoa("XACABALLERO:Seidor08*");
    //var buf = btoa("XACABALLERO:Seidor12*");
    // contranseña para QIM CALIDAD
    var buf = btoa("INTRANCOMUNI:Intr4netC01");
    //console.log("Contraaaa    " + buf + "  Contraaaaa  ");
    //this.ListaWD = this.solicitudComp.getWebServiceSAP1();
  }

  //selectedFecha(type: string, event:MatDatepickerInputEvent<Date>){
  selectedFecha() {
    //console.log("dentro de el metodooooooo */*/*/*/* s");
    //console.log(event.value.toISOString().substring(0,10));
    var time = new Date();
    var date = new Date();
    //console.log(event.value.toISOString());
    //var FechaSelect = this.Date.value.substring(0, 10);
    //console.log(date.tolo());
    //console.log(date.getMonth());
    //console.log(date.getFullYear());
    var FechaSelect = date.toLocaleDateString();
    var day = date.getDate();
    var mo = date.getUTCMonth();
    var mont = mo + 1;
    var year = date.getFullYear();
    // console.log(day);
    // console.log(mont + 1);
    // console.log("---------" + year);
    // console.log(date.getUTCMonth());
    // console.log(mont.toLocaleString());

    var FechaConHora = time.toLocaleTimeString();
    var fechayhora = year + "-" + mont + "-" + day + " " + FechaConHora;
    //console.log(fechayhora);
    this.date = fechayhora;

    // var dayreal = this.Date.value.substring(8, 10);
    // //var mont = date.toLocaleDateString().substring(3,4);
    // var montR = '0'+mont;
    // var montreal = this.Date.value.substring(5,7);
    // console.log("mont -->"+montR);
    //console.log("montreal --->"+montreal);

    // console.log(day);
    // console.log(dayreal);

    // if(montR == montreal){
    //    console.log("los meses son iguales");
    // }else{
    //    console.log("los mese no coinciden");
    //    var mesmenor = montreal-1;
    //    console.log("mes menor menos uno    "+ mesmenor);
    //       if(day == dayreal){
    //         console.log("las fechas son iguales");
    //         var fecha = this.Date.value.substring(0, 10);
    //         var fechayhora = fecha+" "+FechaConHora;
    //         console.log(fechayhora);
    //         this.date = fechayhora;
    //       }else{
    //         console.log("las fechas no son iguales");
    //         var fecha = this.Date.value.substring(0,8);
    //         var diamenor = dayreal-1;
    //         var fechayhora = fecha + diamenor +" "+FechaConHora;
    //         console.log(fechayhora);
    //         this.date=fechayhora;
    //       }
    // }

    //console.log(this.Date.value.substring(0, 10));
    //console.log(FechaConHora);
    // var Horas = time.getHours();
    // var Minutos = time.getMinutes();
    // var Segundos = time.getSeconds();
    // var HoraExacta = Horas+":"+Minutos+":"+Segundos+" ";
    //console.log("Esta es la fecha---->" + FechaSelect);
    //var fechayhora = fecha+" "+FechaConHora;
    // var mydatetime = new Date(fechayhora);
    // this.date= fechayhora;
    // console.log(this.date + " ***** ") ;
    //console.log("Pm o AM--->" + time.toTimeString());
  }

  getAllEmpre() {
    this.ListEmpresa = this.solicitudComp.getEmpresas();
    //this.banks = this.solicitudComp.getEmpresas();
    //set initial selection
    this.EmpresaCtrl.setValue(this.ListEmpresa[0]);

    // cargar la lista Empresas inicial
    this.filteredEmpresa.next(this.ListEmpresa);

    // escuche los cambios en el valor del campo de búsqueda
    this.EmpreFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterEmpresa();
      });
    //modo anterior para conectarse al servicio y a SQLServer
    // this.solicitudComp.getEmpresas().subscribe(
    //   data =>{this.ListEmpresa = data},
    //   //console.log(data)
    // error => console.log('ERRRRORRRR' + error),

    // );
  }

  protected filterEmpresa() {
    //console.log("hola");
    if (!this.ListEmpresa) {
      return;
    }
    // get the search keyword
    let search = this.EmpreFilterCtrl.value;
    if (!search) {
      //console.log(search);
      this.filteredEmpresa.next(this.ListEmpresa.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredEmpresa.next(
      this.ListEmpresa.filter(
        (empre) => empre.Butxt.toLowerCase().indexOf(search) > -1
      )
    );
  }

  selectedEmpresa() {
    this.selectedFecha();
    // console.log(this.DataInsert.Empresa.Bukrs);
    // console.log(this.DataInsert.Empresa.Butxt);

    // console.log("entrando al metodo filtro");
    this.getAllSucursalesPlazaByIdEmpresa(this.DataInsert.Empresa);
    this.getAllActivo(this.DataInsert.Empresa);
    this.getAllGrupoCompra(this.DataInsert.Empresa);
    this.getunidadMedida("");
    this.getAllNecesidad();
  }

  getAllSucursalesPlazaByIdEmpresa(Idempresa: Empresa) {
    this.ListSucuPlaza = this.solicitudComp.getAllSucursalPlazaByIdEmpresa(
      Idempresa
    );
    this.SucursalCtrl.setValue(this.ListSucuPlaza[0]);

    // cargar la lista Empresas inicial
    this.filteredSucursal.next(this.ListSucuPlaza);

    // escuche los cambios en el valor del campo de búsqueda
    this.SucursalFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterSucursal();
      });
    //version pasada como se recuperan las sucursales desde servicio y SQL
    // this.solicitudComp.getAllSucursalPlazaByIdEmpresa(Idempresa).subscribe(
    //   data=> this.ListSucuPlaza = data,
    //     //console.log(data);

    //   //},
    //   error=> console.log("errrorrrr"+error)
    // );
  }

  protected filterSucursal() {
    if (!this.SucursalFilterCtrl) {
      return;
    }
    // obtener la palabra clave de búsqueda
    let search = this.SucursalFilterCtrl.value;
    if (!search) {
      this.filteredSucursal.next(this.ListSucuPlaza.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filtrar las Sucursales
    this.filteredSucursal.next(
      this.ListSucuPlaza.filter(
        (sucur) => sucur.IdPlaza.toLowerCase().indexOf(search) > -1
      )
    );
  }

  async getAllCategorias(){
    console.log("buscamos las categorias");
    try {
      this.ListCategorias = await this.solicitudComp.getAllCategorias();
      if(!this.ListCategorias){
        this.toast.setMessage("Error al recuperar las categorias", "warning");
      }
    } catch (error) {
      if (error.status == 403 || error.status == 404) {
        this.auth.logout();
      }else{
        this.toast.setMessage(error.message,"danger");
      }
      
    }
  }



  selectedPlaza() {
    // console.log("dentro de el metodo que selecciona");
    // console.log(this.DataInsert.Plaza.IdPlaza);
    // console.log(this.DataInsert.Plaza.Nombre);
    this.getAllCentroCosto(this.DataInsert.Empresa, this.DataInsert.Plaza);
    this.getAllAlmacen(this.DataInsert.Plaza);
  }


 

  getAllCentroCosto(idEmpresa: Empresa, idPlaza: SucursalPlaza) {
    // console.log(
    //   "Centro de Costos--->>" + idEmpresa.Bukrs + "     " + idPlaza.Nombre
    // );
    this.ListCCostos = this.solicitudComp.getCentoCosto(idEmpresa, idPlaza);
    this.CCostosCrtl.setValue(this.ListCCostos[0]);
    this.filteredCCostos.next(this.ListCCostos);

    this.CCosotosFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCCosotos();
      });
    //forma anterior de traer informacion de base de datos sql.
    // this.solicitudComp.getCentoCosto().subscribe(
    //     data=> this.ListCCostos = data,y
    //       //console.log(data)

    //     //},
    //     error => console.log('ERRRRROOOORRRRRR' + error)
    // );
  }

  filterCCosotos() {
    if (!this.CCosotosFilterCtrl) {
      return;
    }
    //obtenemos la palabra clave buscar
    let search = this.CCosotosFilterCtrl.value;
    //console.log(search);
    if (!search) {
      this.filteredCCostos.next(this.ListCCostos.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredCCostos.next(
      this.ListCCostos.filter(
        (ccosto) => ccosto.IdCentroCosto.toLowerCase().indexOf(search) > -1
      )
      //this.ListCCostos.filter(ccosoton => ccosoton.Nombre.toLowerCase().indexOf(search)> -1)
    );
  }

  SelectedCentroCostos() {
    //pasamos los datos seleccionado a el objeto Producto
    var IdCCosto: any = this.DataInsert.CentroCostos.IdCentroCosto;
    var CCosto: any = this.DataInsert.CentroCostos.Nombre;
    this.SelectedCostos = this.DataInsert.CentroCostos;
    this.Producto.CentroCosto = IdCCosto;
    this.Producto.CentroCostoName = CCosto;
    // console.log(this.DataInsert.CentroCostos);
    // console.log(this.DataInsert.CentroCostos.Nombre);
    //console.log(this.CentroCostos.value);
  }

  getAllCuentasMayor(idEmpresa: Empresa, SolPedAcronimo: string) {
    if (this.DataInsert.Imputacion != undefined) {
      // console.log("Este es el Tipo de Silicitud-------> " + SolPedAcronimo);
      if (this.DataInsert.Imputacion.IdTipoSolicitud == 2) {
        this.ListCmayor = this.solicitudComp.getCuentaMayor(
          idEmpresa,
          this.DataInsert.Imputacion.Acronimo
        );
        this.CMayorCtrl.setValue(this.ListCmayor[0]);
        this.filteredCMayor.next(this.ListCmayor);
        this.CMayorFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterCmayor();
          });
      } else {
        this.ListCmayor = this.solicitudComp.getCuentaMayor(idEmpresa, " ");
        this.CMayorCtrl.setValue(this.ListCmayor[0]);
        this.filteredCMayor.next(this.ListCmayor);
        this.CMayorFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterCmayor();
          });
      }
    }
    //manera antigua de traer informacion desde el sql.
    // this.solicitudComp.getCuentaMayor().subscribe(
    //   data => this.ListCmayor = data,
    //     //console.log(data);
    //   //},
    //   error=> console.log("errroooorrr" + error)
    // );
  }

  filterCmayor() {
    if (!this.CMayorFilterCtrl) {
      return;
    }
    //obtenemos la palabra clave
    let search = this.CMayorFilterCtrl.value;
    if (!search) {
      this.filteredCMayor.next(this.ListCmayor.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredCMayor.next(
      this.ListCmayor.filter(
        (cmayor) => cmayor.Nombre.toLowerCase().indexOf(search) > -1
      )
    );
  }

  selectionCMayor() {
    var IdCMayor: any = this.DataInsert.Cuentamayor.IdCuentaMayor;
    var CMayorName: any = this.DataInsert.Cuentamayor.Nombre;
    this.SelectedCMayor = this.DataInsert.Cuentamayor;
    this.Producto.CuentaMayor = IdCMayor;
    this.Producto.CuentaMayorName = CMayorName;
    // console.log(this.DataInsert.Cuentamayor.IdCuentaMayor);
    // console.log(this.DataInsert.Cuentamayor.Nombre);
  }

  getAllActivo(IdEmpresa: Empresa) {
    this.ListActivo = this.solicitudComp.getAllActivo(IdEmpresa);
    this.ActivoCrtl.setValue(this.ListActivo[0]);
    this.filteredActivo.next(this.ListActivo);
    this.ActivoFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterActivo();
      });
    //forma de pedir informacion a sql server
    // this.solicitudComp.getAllActivo().subscribe(data =>{
    //   console.log("datos de el Activo-" + data)
    //   this.ListActivo = data
    // }, err => console.log("error al recuperar activos" + err));
  }

  filterActivo() {
    if (!this.ActivoFilterCtrl) {
      return;
    }
    //obtenemos la palabra clave
    let search = this.ActivoFilterCtrl.value;
    if (!search) {
      this.filteredActivo.next(this.ListActivo.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredActivo.next(
      this.ListActivo.filter(
        (activo) => activo.Nombre.toLowerCase().indexOf(search) > -1
      )
    );
  }

  SelectActivo() {
    //console.log("datos en NGMODEL ACTIVO---->" + this.DataInsert.NActivo.IdActivo+ "-------" + this.DataInsert.NActivo.Nombre);
    var idactivo: any = this.DataInsert.NActivo.IdActivo;
    var activoname: any = this.DataInsert.NActivo.Nombre;
    this.Producto.NumActivo = idactivo;
    this.Producto.NameActivo = activoname;
  }

  getOrdenInterna(idEmpresa: Empresa, SolPed: Imputacion) {
    this.ListOrdenInterna = this.solicitudComp.getAllOrdenInterna(
      idEmpresa,
      SolPed
    );
  }

  selectionOrdenInter() {
    this.SelectedOInvercion = this.DataInsert.OrdenInterna;
    //console.log("Este es el id de la orden interna--->" + this.DataInsert.OrdenInterna.IdOrdenInterna);
    //console.log("Este es en nombre de la orden interna--->" + this.DataInsert.OrdenInterna.NombreOrder);
  }

  getAllArea(idUser: number) {
    this.solicitudComp.getAllAreas(idUser).subscribe(
      (data) => (this.ListAreas = data),
      (error) => {
        if (error.status == 403 || error.status == 404) {
          this.toast.setMessage(error.message, "danger");
          this.auth.logout();
        }
        console.log("Error al traer las Areas" + error);
      }
    );
  }

  selectedArea() {
    // console.log(this.DataInsert.Area.IdDireccion);
    // console.log(this.DataInsert.Area.Nombre);
    this.buscaIdAutorizador(this.DataInsert.Area);
  }

  getAllImputaciones() {
    this.solicitudComp.getAllImputaciones().subscribe(
      (data) => {
        //console.log(data);
        this.ListImputacion = data;
      },
      (error) => {
        if (error.status == 403 || error.status == 404) {
          this.toast.setMessage(error.message, "danger");
          this.auth.logout();
        }
        console.log(error);
      }
    );
  }

  selectedImputacion() {
    //console.log("ngModel Imputacion   -" + this.Imputacion.value.trim() + "-*");
    // console.log(this.DataInsert.Imputacion.IdTipoSolicitud);
    // console.log(this.DataInsert.Imputacion.Nombre);
    // console.log(this.DataInsert.Imputacion.Acronimo);
    // console.log(this.DataInsert.Productos.length);

    if (this.DataInsert.Productos.length != 0) {
      this.toast.setMessage(
        "No se puede Cambiar el Tipo de Solicitud cuando ya se crearon Materiales/Servicios para la Solicitud",
        "danger"
      );
    } else {
      if (this.DataInsert.Imputacion.IdTipoSolicitud == 1) {
        //ocultamos la Seleccion de Tipo de Solicitud por item
        //this.solpedforitem = false;
        //TIPO DE IMPUTACUION A -----se bloquearan Centro de Costos, Orden interna, Cta. Mayor
        this.AplicaCenCost = true;
        this.AplicaOrdInt = true;
        this.AplicaCtaMayor = true;
        this.AplicaMat = true;
        this.AplicaAlma = true;
        //this.AplicaCentro = false;
        this.AplicaNumActivo = false;
        //vaciando los Selects de Almacen y Materiales.
        this.ListAlmacen = undefined;
        this.ListMateriales = undefined;
        this.AplicaUsobien = false;
        this.isAddHijos = false;
        this.isbloqued = false;
        this.AplicaUMedida = false;
        //this.getAllPosiciones(this.DataInsert.Imputacion);

        this.SelectOrdenEstadisitica;

        //llamamos los metodos que dependen de un cambio para limpiar los registros
        this.getAllCentroCosto(this.DataInsert.Empresa, this.DataInsert.Plaza);
        this.getAllCuentasMayor(this.DataInsert.Empresa, "");
        this.getAllActivo(this.DataInsert.Empresa);
        //cuando se seleccione este tipo de Solicitud se mandara a llamar metodo de unidad de medida para el llenado sin idmaterial
        var Material: String = " ";
        this.getunidadMedida(Material);
      } else if (this.DataInsert.Imputacion.IdTipoSolicitud == 2) {
        //ocultamos la Seleccion de Tipo de Solicitud por item
        //this.solpedforitem = false;
        //TIPO DE IMPUTACION F ----ninguno se bloquea y todos son obligatorios Centro de Costos, Orden interna, Cta. Mayor
        this.AplicaCenCost = true;
        this.AplicaOrdInt = false;
        this.isProduction = false;
        this.AplicaCtaMayor = false;
        this.AplicaMat = true;
        this.AplicaAlma = true;
        //this.AplicaCentro = false;
        this.AplicaNumActivo = true;
        //vaciando los Selects de Almacen y Materiales.
        //this.ListAlmacen = undefined;
        this.ListMateriales = undefined;
        this.AplicaUsobien = false;
        this.isAddHijos = false;
        this.isbloqued = false;
        this.AplicaUMedida = false;
        //this.getAllPosiciones(this.DataInsert.Imputacion);
        this.getAllGrupoCompra(this.DataInsert.Empresa);
        //cuando se seleccione este tipo de Solicitud se mandara a llamar metodo de unidad de medida para el llenado sin idmaterial
        var Material: String = " ";
        this.getunidadMedida(Material);
        this.getAllActivo(this.DataInsert.Empresa);
        this.getAllNecesidad();
        this.getOrdenInterna(
          this.DataInsert.Empresa,
          this.DataInsert.Imputacion
        );
        //llamamos los metodos que dependen de un cambio para limpiar los registros
        this.getAllCentroCosto(this.DataInsert.Empresa, this.DataInsert.Plaza);
        this.getAllCuentasMayor(
          this.DataInsert.Empresa,
          this.DataInsert.Imputacion.Acronimo
        );
      } else if (this.DataInsert.Imputacion.IdTipoSolicitud == 3) {
        //ocultamos la Seleccion de Tipo de Solicitud por item
        //this.solpedforitem = false;
        //TIPO DE IMPUTCION K ------- solo se bloquea Orden Interna, y quedan como obligatorioCentro de Costos y Cta de mayor
        this.ListOrdenInterna = [];
        this.AplicaCenCost = false;
        this.AplicaOrdInt = true;
        this.isProduction = false;
        this.AplicaCtaMayor = false;
        this.AplicaMat = true;
        this.AplicaAlma = true;
        //this.AplicaCentro = false;
        this.AplicaNumActivo = true;
        //vaciando los Selects de Almacen y Materiales.
        this.ListAlmacen = undefined;
        this.ListMateriales = undefined;
        this.AplicaUsobien = false;
        this.isAddHijos = false;
        this.isbloqued = false;
        this.AplicaUMedida = false;
        //this.getAllPosiciones(this.DataInsert.Imputacion);
        //llamamos los metodos que dependen de un cambio para limpiar los registros
        this.getAllCentroCosto(this.DataInsert.Empresa, this.DataInsert.Plaza);
        this.getAllCuentasMayor(this.DataInsert.Empresa, "");
        this.getAllGrupoCompra(this.DataInsert.Empresa);
        //cuando se seleccione este tipo de Solicitud se mandara a llamar metodo de unidad de medida para el llenado sin idmaterial
        var Material: String = " ";
        this.getunidadMedida(Material);
      } else if (this.DataInsert.Imputacion.IdTipoSolicitud == 4) {
        //ocultamos la Seleccion de Tipo de Solicitud por item
        //this.solpedforitem = false;
        //TIPO DE SOLICITUD KF Servicios
        this.AplicaCenCost = true;
        this.AplicaOrdInt = true;
        this.isProduction = false;
        this.AplicaCtaMayor = true;
        this.AplicaMat = true;
        this.AplicaAlma = true;
        this.AplicaNumActivo = true;
        this.ListAlmacen = undefined;
        this.ListMateriales = undefined;
        this.AplicaUsobien = false;
        this.isAddHijos = true;
        this.disabledforchild = true;
        //bloqueamos campos de Cantidad y Precio para el tipo de Sol 4
        this.isbloqued = true;
        this.AplicaUMedida = true;
        this.getAllCentroCosto(this.DataInsert.Empresa, this.DataInsert.Plaza);
        this.getAllCuentasMayor(this.DataInsert.Empresa, "");
        var Material: String = " ";
        this.getunidadMedida(Material);
        this.getAllNecesidad();
        this.GetAllOrdenEstadistica(
          this.DataInsert.Empresa,
          this.DataInsert.Imputacion
        );
      } else if (this.DataInsert.Imputacion.IdTipoSolicitud == 5) {
        //ocultamos la Seleccion de Tipo de Solicitud por item
        //this.solpedforitem = false;
        //TIPO DE IMPUTACION NORMAL ------- se bloquea centro de costos , orden interna, cta de mayor, almacen
        this.AplicaCenCost = true;
        this.AplicaOrdInt = true;
        this.isProduction = false;
        this.AplicaCtaMayor = true;
        this.AplicaMat = false;
        this.AplicaAlma = false;
        //this.AplicaCentro = false;
        this.AplicaNumActivo = true;
        this.AplicaUsobien = true;
        this.isAddHijos = false;
        this.isbloqued = false;
        this.AplicaUMedida = false;
        //this.getAllPosiciones(this.DataInsert.Imputacion);
        //llamamos los metodos que dependen de un cambio para limpiar los registros
        this.getAllCentroCosto(this.DataInsert.Empresa, this.DataInsert.Plaza);
        this.getAllCuentasMayor(this.DataInsert.Empresa, "");
      } else if (this.DataInsert.Imputacion.IdTipoSolicitud == 6) {
        this.AplicaCenCost = false;
        this.AplicaOrdInt = true;
        this.isProduction = true;
        this.AplicaCtaMayor = false;
        this.AplicaMat = true;
        this.AplicaAlma = true;
        //this.AplicaCentro = false;
        this.AplicaNumActivo = true;
        this.isAddHijos = false;
        this.isbloqued = false;
        //vaciando los Selects de Almacen y Materiales.
        //this.ListAlmacen = undefined;
        this.filteredMaterial = undefined;
        this.AplicaUsobien = false;
        this.AplicaUMedida = false;

        this.getAllAlmacen(this.DataInsert.Plaza);
        //this.getAllMateriales(this.DataInsert.Plaza, this.DataInsert.Almacen);
        this.getAllCuentasMayor(this.DataInsert.Empresa, " ");
        this.getAllGrupoCompra(this.DataInsert.Empresa);
        this.GetAllOrdenEstadistica(
          this.DataInsert.Empresa,
          this.DataInsert.Imputacion
        );
        this.getunidadMedida("");
      } else if (this.DataInsert.Imputacion.IdTipoSolicitud == 7) {
        this.AplicaCenCost = true;
        this.AplicaOrdInt = true;
        this.isProduction = false;
        this.AplicaCtaMayor = true;
        this.AplicaMat = true;
        this.AplicaAlma = true;
        this.AplicaNumActivo = true;
        this.ListAlmacen = undefined;
        this.ListMateriales = undefined;
        this.AplicaUsobien = false;
        this.isAddHijos = true;
        this.disabledforchild = false;
        //se bloquen acampos de Cantidad y Precio para Tipo de SOlicitud 7
        this.isbloqued = true;
        this.AplicaUMedida = true;
        var Material: String = " ";
        this.getunidadMedida(Material);
        this.getAllNecesidad();
        this.GetAllOrdenEstadistica(
          this.DataInsert.Empresa,
          this.DataInsert.Imputacion
        );
      }
    }
    // //this.DataInsert.CentroCostos.Nombre = '';
    // //se le da el ID de la Imputacion Seleccionada al Servicio, para que nos regrese la Informacion Correcta
    // this.getAllPosiciones(this.DataInsert.Imputacion);
  }

  getListTipoSolPedporItem() {
    //console.log("recuperamos y habilitamos los Tipos de Solicitudes por Item");
    this.solicitudComp.getAllimputacionesForItem().subscribe(
      (data) => {
        //console.log(data);
        this.ListImputacionForItem = data;
      },
      (error) => {
        if(error.status == 403 || error.status == 404){
          this.toast.setMessage(
            error.message,
            "danger"
          );
          this.auth.logout();
        }
      }
    );
  }


  getAllPosiciones(IdImputacion: Imputacion) {
    this.solicitudComp.getAllPosicionesByImputacion(IdImputacion).subscribe(
      (data) => (this.ListPosicion = data),
      (error) => console.log(error)
    );
  }

  selectPosicion() {
    // console.log(this.DataInsert.Posicion.IdPosicion);
    // console.log(this.DataInsert.Posicion.Nombre);
    // console.log(this.DataInsert.Posicion.Acronimo);
    //console.log("///"+this.Posicion.value+"*//");
  }

  getAllAlmacen(idplaza: SucursalPlaza) {
    this.ListAlmacen = this.solicitudComp.getAllAlmacen(idplaza);
    this.AlmacenCrtl.setValue(this.ListAlmacen[0]);
    this.filteredAlmacen.next(this.ListAlmacen);
    this.AlmacenFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAlmacen();
      });
    //forma anterior de solicitar almacenes a sql
    // this.solicitudComp.getAllAlmacen().subscribe(
    //   data =>{ this.ListAlmacen = data},
    //   error => console.log(error)
    // );
  }

  filterAlmacen() {
    if (!this.AlmacenFilterCtrl) {
      return;
    }
    //obtenemos la palabra clave
    let search = this.AlmacenFilterCtrl.value;
    if (!search) {
      this.filteredAlmacen.next(this.ListAlmacen.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredAlmacen.next(
      this.ListAlmacen.filter(
        (alma) => alma.Nombre.toLowerCase().indexOf(search) > -1
      )
    );
  }

  selectedAlmacen() {
    //console.log("Este es el id de el almacen con FormControl----->" + this.Almacen.value);
    // console.log(
    //   "NgModel--->" +
    //     this.DataInsert.Almacen.IdAlmacen +
    //     "------" +
    //     this.DataInsert.Almacen.IdAlmacen
    // );
    var idAlmacen: any = this.DataInsert.Almacen.IdAlmacen;
    var namealmacen: any = this.DataInsert.Almacen.Nombre;
    this.Producto.Almacen = idAlmacen;
    this.Producto.AlmacenName = namealmacen;

    this.getAllMateriales(this.DataInsert.Plaza, this.DataInsert.Almacen);
  }

  getAllMateriales(idplaza: SucursalPlaza, idalmacen: Almacen) {
    this.ListMateriales = this.solicitudComp.getAllmateriales(
      idplaza,
      idalmacen
    );
    this.MaterialesCtrl.setValue(this.ListMateriales[0]);
    this.filteredMaterial.next(this.ListMateriales);
    this.MaterialesFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterMaterial();
      });
    //forma de solicitar datos a SQL server....
    // this.solicitudComp.getAllmateriales().subscribe(data =>{
    //   console.log("Materiales" + data);
    //   this.ListMateriales = data;
    // },err=>console.log('error al recuperar los materiales' + err));
  }

  filterMaterial() {
    if (!this.MaterialesFilterCtrl) {
      return;
    }
    //obtenemos la palabra clave
    let search = this.MaterialesFilterCtrl.value;
    if (!search) {
      this.filteredMaterial.next(this.ListMateriales.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredMaterial.next(
      this.ListMateriales.filter(
        (mat) => mat.Nombre.toLowerCase().indexOf(search) > -1
      )
    );
  }

  SelectMat() {
    //console.log("pasamos la info de un NGmodel a el FORM -->" + this.DataInsert.Materiales.IdMaterial + "-------" + this.DataInsert.Materiales.Nombre);
    var idMaterial: any = this.DataInsert.Materiales.IdMaterial;
    var MaterialName: any = this.DataInsert.Materiales.Nombre;
    if (this.DataInsert.Imputacion.IdTipoSolicitud == 5) {
      this.DataInsert.UsoBien = this.DataInsert.Materiales.Nombre;
      this.AplicaUsobien = true;
    }
    this.Producto.Material = idMaterial;
    this.Producto.MaterialName = MaterialName;
    this.getunidadMedida(this.DataInsert.Materiales.IdMaterial);
  }

  getAllGrupoCompra(IdEmpresa: Empresa) {
    //console.log("Este es el Id de la empresa para recuperar los grupos de compras    " + IdEmpresa);
    this.ListGrupoCompra = this.solicitudComp.getAllGrupoCompra(IdEmpresa);
    this.GCompraCtrl.setValue(this.ListGrupoCompra[0]);
    this.filteredGCompra.next(this.ListGrupoCompra);
    this.GCompraFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterGrupoCompra();
      });
    //forma anterior de solicitar Grupos de compra desde el sql
    // this.solicitudComp.getAllGrupoCompra().subscribe(
    //   data => this.ListGrupoCompra = data,
    //   error => console.log(error)
    // );
  }

  filterGrupoCompra() {
    if (!this.GCompraFilterCtrl) {
      return;
    }
    //obtenemos la palabra clave
    let search = this.GCompraFilterCtrl.value;
    if (!search) {
      this.filteredGCompra.next(this.ListGrupoCompra.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredGCompra.next(
      this.ListGrupoCompra.filter(
        (gcompra) => gcompra.Nombre.toLowerCase().indexOf(search) > -1
      )
    );
  }

  SelectGrupoCompra() {
    //console.log("Datos desde el NGMODEL se pasan a un FORMULARIO---->" + this.DataInsert.GCompra.IdGrupoCompra + "   " + this.DataInsert.GCompra.Nombre);
    var idgrupoCompra: any = this.DataInsert.GCompra.IdGrupoCompra;
    var grupocompraname: any = this.DataInsert.GCompra.Nombre;
    this.Producto.GrupCompra = idgrupoCompra;
    this.Producto.NameGrupoCompra = grupocompraname;
  }

  GetAllOrdenEstadistica(Empre: Empresa, SolPed: Imputacion) {
    this.ListOrdEstadistica = this.solicitudComp.getAllOrdenInterna(
      Empre,
      SolPed
    );
    this.OrdenEstadisticaCrtl.setValue(this.ListOrdEstadistica[0]);
    this.filteredOrdenEstadistica.next(this.ListOrdEstadistica);
    this.OrdenEstadisticaFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOrdenEstadistica();
      });
  }

  filterOrdenEstadistica() {
    if (!this.OrdenEstadisticaFilterCtrl) {
      return;
    }
    //obtenemos la palabra clave
    let search = this.OrdenEstadisticaFilterCtrl.value;

    if (!search) {
      this.filteredOrdenEstadistica.next(this.ListOrdEstadistica.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredOrdenEstadistica.next(
      this.ListOrdEstadistica.filter(
        (oestad) => oestad.NombreOrder.toLowerCase().indexOf(search) > -1
      )
    );
  }

  SelectedOrdenestadistica() {
    //console.log("Esta es la orden Estadisitica que se selecciono------> " + this.DataInsert.OrdenEstadistica.NombreOrder);
    // console.log(
    //   "Esta es la orden Estadisticaaaaaa------->>" +
    //     this.SelectOrdenEstadisitica.NombreOrder
    // );
    //pasamos los resultados a la variable del DataInsett para que este lleno cuando se valide
    this.DataInsert.OrdenEstadistica = this.SelectOrdenEstadisitica;

    //se tiene que agregar la ordenEstadistica seleccionada a la opcion por ITEM de los Productos
    this.Producto.IdOrdenEstadistica = this.SelectOrdenEstadisitica.IdOrdenInterna;
    this.Producto.OrdenEstadisticaName = this.SelectOrdenEstadisitica.NombreOrder;
    // console.log("ya en lista de producto" + this.Producto.OrdenEstadisticaName);
    // console.log("ya en lista de producto" + this.Producto.IdOrdenEstadistica);
  }

  getAllMoendas() {
    //console.log("Metodo para recuperar monedas");
    this.solicitudComp.GetAllMonedas().subscribe(
      (data) => {
        //console.log(data);
        this.ListMoneda = data;
      },
      (error) => {
        if(error.status == 403 || error.status == 404){
          this.toast.setMessage(
            error.message,
            "danger"
          );
          this.auth.logout();
        }
        console.log("error al recuperar las monedas");
      }
    );
  }

  getunidadMedida(idMaterial: String) {
    //console.log("Id de el Material ---> " + idMaterial);
    this.ListUnidadMedida = this.solicitudComp.GetAllUnidadMedida(idMaterial);
    this.UnidadMedidaCtrl.setValue(this.ListUnidadMedida[0]);
    this.filteredUnidadMedida.next(this.ListUnidadMedida);
    this.UnidadMedidaFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterunidadMedida();
      });
  }

  filterunidadMedida() {
    if (!this.UnidadMedidaFilterCtrl) {
      return;
    }
    //obtenemos la palabra clave
    let search = this.UnidadMedidaFilterCtrl.value;
    if (!search) {
      this.filteredUnidadMedida.next(this.ListUnidadMedida.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredUnidadMedida.next(
      this.ListUnidadMedida.filter(
        (umedida) =>
          umedida.NombreUnidadMedida.toLowerCase().indexOf(search) > -1
      )
    );
  }

  SelectunidadMedida() {
    //console.log("datos en un NGMODEL---> " + this.DataInsert.UMedida.IdUnidadMedida +"   " + this.DataInsert.UMedida.NombreUnidadMedida);

    var idumedida: any = this.DataInsert.UMedida.IdUnidadMedida;
    var umedidaname: any = this.DataInsert.UMedida.NombreUnidadMedida;
    this.Producto.UnidadMedida = idumedida;
    this.Producto.NameUnidadMedida = umedidaname;
  }

  getAllNecesidad() {
    //console.log("-----------------------------*/*/*/*/*/*/*/*/*/*/*/---------------------------------------------");
    this.solicitudComp.getAllNecesidad().subscribe(
      (data) => (this.ListNecesidad = data),
      (error) => console.log(error)
    );
  }

  SelctedNecesidad() {
    //console.log("datos desde un NGMODEL Necesidad--->" + this.DataInsert.Necesidad.IdNecesidad+ "     " + this.DataInsert.Necesidad.Nombre);
    var idnecesidad: any = this.DataInsert.Necesidad.IdNecesidad;
    var namenecesidad: any = this.DataInsert.Necesidad.Nombre;
    this.Producto.NumNeces = idnecesidad;
    this.Producto.NameNeces = namenecesidad;
  }

  //modificacion de precion a moneda de MXN
  changePrice(value: string) {
    //console.log("se cambio el valor del Precio----->" + value);
    let pricefoat = parseFloat(value);
    console.log("Este es el precio ------->" + pricefoat);
    this.DataInsert.Precio = pricefoat;
    console.log(this.DataInsert.Precio);
    //console.log("valor en variable del modelo-->" + this.DataInsert.Precio);
    if (Number.isNaN(pricefoat)) {
      pricefoat = 0;
      this.price = "";
    } else {
      this.price = formatCurrency(
        pricefoat,
        "en-US",
        getCurrencySymbol("USD", "wide")
      );
      this.Producto.PriceView = formatCurrency(
        pricefoat,
        "en-US",
        getCurrencySymbol("USD", "wide")
      );
    }
  }

  //metodos donde se agregan los materiales con todas sus caracteristicas
  async addProductos() {
    // if(this.DataInsert.Imputacion.IdTipoSolicitud != 6){
    //primero recuperamos los valores ingresados y despues los pasamos a el objeto Producto.

    var cantidad: number = this.DataInsert.Cantidad;
    var precio: number = this.DataInsert.Precio;
    var espesificaciones: string = this.DataInsert.Espf;
    var usobien: string = this.DataInsert.UsoBien;
    this.Producto.UsoProd = await this.RemoveCaracteresEpeciales(usobien);
    this.Producto.Espf = await this.RemoveCaracteresEpeciales(espesificaciones);
    if (
      this.DataInsert.Imputacion.IdTipoSolicitud == 4 ||
      this.DataInsert.Imputacion.IdTipoSolicitud == 7
    ) {
      this.Producto.Cantidad = 0;
      this.Producto.Precio = 0;
      this.Producto.PriceView = "0";
      this.price = "";
      this.Producto.NombreSolPed = "";
      this.Producto.AcronimoSolPed = "";
      this.Producto.Espf = espesificaciones;
      this.Producto.UsoProd = usobien;

      this.UMedida.IdUnidadMedida = "SRV";
      this.UMedida.NombreUnidadMedida = "SRV";

      this.Producto.UnidadMedida = this.UMedida.IdUnidadMedida;
      this.Producto.NameUnidadMedida = this.UMedida.NombreUnidadMedida;
    } else {
      this.Producto.Cantidad = cantidad;
      this.Producto.Precio = precio;
      this.price = "";
      this.Producto.NombreSolPed = "";
      this.Producto.AcronimoSolPed = "";
      this.Producto.Espf = espesificaciones;
      this.Producto.UsoProd = usobien;
    }

    if (
      this.DataInsert.Productos.length == 0 ||
      this.DataInsert.Productos.length == null
    ) {
      this.Producto.IdPrduct = 1;
    } else {
      var Id = this.DataInsert.Productos.length;
      this.Producto.IdPrduct = Id + 1;
    }




    if (this.DataInsert.Imputacion.IdTipoSolicitud == 1) {
      // console.log(this.Producto.UsoProd);
      // console.log(this.Producto.Espf);

      if (
        this.Producto.CentroCosto == undefined &&
        this.SelectedOInvercion == undefined &&
        this.Producto.CuentaMayor == undefined &&
        this.Producto.GrupCompra != undefined &&
        this.Producto.UnidadMedida != undefined &&
        this.Producto.NumActivo != undefined &&
        this.Producto.NumNeces != undefined && 
        this.Producto.UsoProd.length != 0 &&
        this.Producto.Espf.length != 0
      ) {
        this.Producto.UsoProd = this.RemoveCaracteresEpeciales(this.Producto.UsoProd);
        this.Producto.Espf = this.RemoveCaracteresEpeciales(this.Producto.Espf);
        //realizamos el push de el objeto de Producot en array de Productos
        this.DataInsert.Productos.push(this.Producto);
        if (this.DataInsert.Productos.length > 0) {
          this.BloqMoreItem = true;
          //this.AplicaCenCost = true;
          this.AplicaOrdInt = true;
          //this.AplicaCtaMayor = true;
        }
        console.log(this.Producto);
        //creamos un nuevo producto y vaciamos los campos de la interfaz.
        this.Producto = new Producto();
        this.DataInsert.Cantidad = 0;
        this.DataInsert.Precio = 1;
        this.price = " ";
        if (this.DataInsert.Almacen != undefined) {
          this.getAllAlmacen(this.DataInsert.Plaza);
        }
        if (this.DataInsert.Materiales != undefined) {
          this.getAllMateriales(this.DataInsert.Plaza, this.DataInsert.Almacen);
        }

        // if(this.DataInsert.Imputacion.IdTipoSolicitud == 2){
        //   this.getAllCuentasMayor(this.DataInsert.Empresa, this.DataInsert.Imputacion.Acronimo);
        // }else{
        //   this.getAllCuentasMayor(this.DataInsert.Empresa, '');
        // }

        this.getAllGrupoCompra(this.DataInsert.Empresa);
        var Material: String = " ";
        //this.getAllCentroCosto( this.DataInsert.Empresa, this.DataInsert.Plaza);
        // this.filteredCCostos = null;
        // this.filteredCMayor = null;

        this.getunidadMedida(Material);
        this.getAllActivo(this.DataInsert.Empresa);
        this.getAllNecesidad();
        this.DataInsert.CentroCostos = this.Producto.CentroCosto;
        //this.getAllCentroCosto( this.DataInsert.Empresa, this.DataInsert.Plaza);

        this.GetAllOrdenEstadistica(
          this.DataInsert.Empresa,
          this.DataInsert.Imputacion
        );
        this.DataInsert.UsoBien = "";
        this.DataInsert.Espf = "";
      } else {
        this.toast.setMessage(
          "Los campos Habilitados son requeridos, por favor valida la informacion",
          "danger"
        );
      }
    }

    if (this.DataInsert.Imputacion.IdTipoSolicitud == 2) {

      if (precio >= 30000) {
        console.log("dentro del if para los 30000 debe mostrar ");
        const dialogRef = this.dialog.open(DialogInfoComponent);

        dialogRef.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`);
        });
      }
      this.getAllCuentasMayor(
        this.DataInsert.Empresa,
        this.DataInsert.Imputacion.Acronimo
      );
      if (
        this.Producto.CentroCosto == undefined &&
        this.SelectedOInvercion != undefined &&
        this.Producto.CuentaMayor != undefined &&
        this.Producto.GrupCompra != undefined &&
        this.Producto.UnidadMedida != undefined &&
        this.Producto.NumActivo == undefined &&
        this.Producto.NumNeces != undefined &&
        this.Producto.UsoProd.length != 0 &&
        this.Producto.Espf.length != 0
      ) {
        this.Producto.UsoProd = this.RemoveCaracteresEpeciales(this.Producto.UsoProd);
        this.Producto.Espf = this.RemoveCaracteresEpeciales(this.Producto.Espf);
        //realizamos el push de el objeto de Producot en array de Productos
        this.DataInsert.Productos.push(this.Producto);
        if (this.DataInsert.Productos.length > 0) {
          this.BloqMoreItem = true;
          //this.AplicaCenCost = true;
          this.AplicaOrdInt = true;
          //this.AplicaCtaMayor = true;
        }
        console.log(this.Producto);
        //creamos un nuevo producto y vaciamos los campos de la interfaz.
        this.Producto = new Producto();
        this.DataInsert.Cantidad = 0;
        this.DataInsert.Precio = 1;
        this.price = " ";
        if (this.DataInsert.Almacen != undefined) {
          this.getAllAlmacen(this.DataInsert.Plaza);
        }
        if (this.DataInsert.Materiales != undefined) {
          this.getAllMateriales(this.DataInsert.Plaza, this.DataInsert.Almacen);
        }

        // if(this.DataInsert.Imputacion.IdTipoSolicitud == 2){
        //   this.getAllCuentasMayor(this.DataInsert.Empresa, this.DataInsert.Imputacion.Acronimo);
        // }else{
        //   this.getAllCuentasMayor(this.DataInsert.Empresa, '');
        // }

        this.getAllGrupoCompra(this.DataInsert.Empresa);
        var Material: String = " ";
        //this.getAllCentroCosto( this.DataInsert.Empresa, this.DataInsert.Plaza);
        // this.filteredCCostos = null;
        // this.filteredCMayor = null;

        this.getunidadMedida(Material);
        this.getAllActivo(this.DataInsert.Empresa);
        this.getAllNecesidad();
        this.DataInsert.CentroCostos = this.Producto.CentroCosto;
        //this.getAllCentroCosto( this.DataInsert.Empresa, this.DataInsert.Plaza);

        this.GetAllOrdenEstadistica(
          this.DataInsert.Empresa,
          this.DataInsert.Imputacion
        );
        this.DataInsert.UsoBien = "";
        this.DataInsert.Espf = "";
      } else {
        this.toast.setMessage(
          "Los campos Habilitados son requeridos, por favor valida la informacion",
          "danger"
        );
      }
    } else {
      this.getAllCuentasMayor(this.DataInsert.Empresa, " ");
    }

    if (this.DataInsert.Imputacion.IdTipoSolicitud == 3) {

      if (precio >= 30000) {
        const dialogRef = this.dialog.open(DialogInfoComponent);

        dialogRef.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`);
        });
      }
      if (
        this.Producto.CentroCosto != undefined &&
        this.SelectedOInvercion == undefined &&
        this.Producto.CuentaMayor != undefined &&
        this.Producto.Material == undefined &&
        this.Producto.Almacen == undefined &&
        this.Producto.GrupCompra != undefined &&
        this.Producto.UnidadMedida != undefined &&
        this.Producto.NumActivo == undefined &&
        this.Producto.NumNeces != undefined &&
        this.Producto.UsoProd.length != 0 &&
        this.Producto.Espf.length != 0
      ) {
        this.Producto.UsoProd = this.RemoveCaracteresEpeciales(this.Producto.UsoProd);
        this.Producto.Espf = this.RemoveCaracteresEpeciales(this.Producto.Espf);
        //realizamos el push de el objeto de Producot en array de Productos
        this.DataInsert.Productos.push(this.Producto);
        if (this.DataInsert.Productos.length > 0) {
          this.BloqMoreItem = true;
          //this.AplicaCenCost = true;
          this.AplicaOrdInt = true;
          //this.AplicaCtaMayor = true;
        }
        console.log(this.Producto);
        //creamos un nuevo producto y vaciamos los campos de la interfaz.
        this.Producto = new Producto();
        this.DataInsert.Cantidad = 0;
        this.DataInsert.Precio = 1;
        this.price = " ";
        if (this.DataInsert.Almacen != undefined) {
          this.getAllAlmacen(this.DataInsert.Plaza);
        }
        if (this.DataInsert.Materiales != undefined) {
          this.getAllMateriales(this.DataInsert.Plaza, this.DataInsert.Almacen);
        }

        // if(this.DataInsert.Imputacion.IdTipoSolicitud == 2){
        //   this.getAllCuentasMayor(this.DataInsert.Empresa, this.DataInsert.Imputacion.Acronimo);
        // }else{
        //   this.getAllCuentasMayor(this.DataInsert.Empresa, '');
        // }

        this.getAllGrupoCompra(this.DataInsert.Empresa);
        var Material: String = " ";
        //this.getAllCentroCosto( this.DataInsert.Empresa, this.DataInsert.Plaza);
        // this.filteredCCostos = null;
        // this.filteredCMayor = null;

        this.getunidadMedida(Material);
        this.getAllActivo(this.DataInsert.Empresa);
        this.getAllNecesidad();
        this.DataInsert.CentroCostos = this.Producto.CentroCosto;
        //this.getAllCentroCosto( this.DataInsert.Empresa, this.DataInsert.Plaza);

        this.GetAllOrdenEstadistica(
          this.DataInsert.Empresa,
          this.DataInsert.Imputacion
        );
        this.DataInsert.UsoBien = "";
        this.DataInsert.Espf = "";
      } else {
        this.toast.setMessage(
          "Los campos Habilitados son requeridos, por favor valida la informacion",
          "danger"
        );
      }
    }

    if (this.DataInsert.Imputacion.IdTipoSolicitud == 4) {

      if (
        this.Producto.CentroCosto == undefined &&
        this.SelectedOInvercion == undefined &&
        this.Producto.CuentaMayor == undefined &&
        this.Producto.Material == undefined &&
        this.Producto.Almacen == undefined &&
        this.Producto.GrupCompra != undefined &&
        this.Producto.UnidadMedida != undefined &&
        this.Producto.NumActivo == undefined &&
        this.Producto.NumNeces != undefined &&
        this.Producto.UsoProd.length != 0 &&
        this.Producto.Espf.length != 0
      ) {
        this.Producto.UsoProd = this.RemoveCaracteresEpeciales(this.Producto.UsoProd);
        this.Producto.Espf = this.RemoveCaracteresEpeciales(this.Producto.Espf);
        //realizamos el push de el objeto de Producot en array de Productos
        this.DataInsert.Productos.push(this.Producto);
        if (this.DataInsert.Productos.length > 0) {
          this.BloqMoreItem = true;
          //this.AplicaCenCost = true;
          this.AplicaOrdInt = true;
          //this.AplicaCtaMayor = true;
        }
        //console.log(this.Producto);
        //creamos un nuevo producto y vaciamos los campos de la interfaz.
        this.Producto = new Producto();
        this.DataInsert.Cantidad = 0;
        this.DataInsert.Precio = 1;
        this.price = " ";
        if (this.DataInsert.Almacen != undefined) {
          this.getAllAlmacen(this.DataInsert.Plaza);
        }
        if (this.DataInsert.Materiales != undefined) {
          this.getAllMateriales(this.DataInsert.Plaza, this.DataInsert.Almacen);
        }

        // if(this.DataInsert.Imputacion.IdTipoSolicitud == 2){
        //   this.getAllCuentasMayor(this.DataInsert.Empresa, this.DataInsert.Imputacion.Acronimo);
        // }else{
        //   this.getAllCuentasMayor(this.DataInsert.Empresa, '');
        // }

        this.getAllGrupoCompra(this.DataInsert.Empresa);
        var Material: String = " ";
        //this.getAllCentroCosto( this.DataInsert.Empresa, this.DataInsert.Plaza);
        // this.filteredCCostos = null;
        // this.filteredCMayor = null;

        this.getunidadMedida(Material);
        this.getAllActivo(this.DataInsert.Empresa);
        this.getAllNecesidad();
        this.DataInsert.CentroCostos = this.Producto.CentroCosto;
        //this.getAllCentroCosto( this.DataInsert.Empresa, this.DataInsert.Plaza);

        this.GetAllOrdenEstadistica(
          this.DataInsert.Empresa,
          this.DataInsert.Imputacion
        );
        this.DataInsert.UsoBien = "";
        this.DataInsert.Espf = "";
      } else {
        this.toast.setMessage(
          "Los campos Habilitados son requeridos, por favor valida la informacion",
          "danger"
        );
      }
    }

    if (this.DataInsert.Imputacion.IdTipoSolicitud == 5) {
      if (precio >= 30000) {
        const dialogRef = this.dialog.open(DialogInfoComponent);

        dialogRef.afterClosed().subscribe((result) => {
          //console.log(`Dialog result: ${result}`);
        });
      }
      if (
        this.Producto.CentroCosto == undefined &&
        this.SelectedOInvercion == undefined &&
        this.Producto.CuentaMayor == undefined &&
        this.Producto.Material != undefined &&
        this.Producto.Almacen != undefined &&
        this.Producto.GrupCompra != undefined &&
        this.Producto.UnidadMedida != undefined &&
        this.Producto.NumActivo == undefined &&
        this.Producto.NumNeces != undefined &&
        this.Producto.UsoProd.length != 0 &&
        this.Producto.Espf.length != 0
      ) {
        this.Producto.UsoProd = this.RemoveCaracteresEpeciales(this.Producto.UsoProd);
        this.Producto.Espf = this.RemoveCaracteresEpeciales(this.Producto.Espf);
        //realizamos el push de el objeto de Producot en array de Productos
        this.DataInsert.Productos.push(this.Producto);
        if (this.DataInsert.Productos.length > 0) {
          this.BloqMoreItem = true;
          //this.AplicaCenCost = true;
          this.AplicaOrdInt = true;
          //this.AplicaCtaMayor = true;
        }
        console.log(this.Producto);
        //creamos un nuevo producto y vaciamos los campos de la interfaz.
        this.Producto = new Producto();
        this.DataInsert.Cantidad = 0;
        this.DataInsert.Precio = 1;
        this.price = " ";
        //  console.log("---------------ññññ--");
        //  console.log(this.DataInsert.Almacen);
        //  console.log(this.DataInsert.Materiales);
        //  console.log("---------------ññññ--");

        if (this.DataInsert.Materiales != undefined) {
          this.getAllMateriales(this.DataInsert.Plaza, this.DataInsert.Almacen);
        }

        // if(this.DataInsert.Imputacion.IdTipoSolicitud == 2){
        //   this.getAllCuentasMayor(this.DataInsert.Empresa, this.DataInsert.Imputacion.Acronimo);
        // }else{
        //   this.getAllCuentasMayor(this.DataInsert.Empresa, '');
        // }

        this.getAllGrupoCompra(this.DataInsert.Empresa);
        var Material: String = " ";
        //this.getAllCentroCosto( this.DataInsert.Empresa, this.DataInsert.Plaza);
        // this.filteredCCostos = null;
        // this.filteredCMayor = null;

        this.getunidadMedida(Material);
        this.getAllActivo(this.DataInsert.Empresa);
        this.getAllNecesidad();
        this.DataInsert.CentroCostos = this.Producto.CentroCosto;
        //this.getAllCentroCosto( this.DataInsert.Empresa, this.DataInsert.Plaza);

        this.GetAllOrdenEstadistica(
          this.DataInsert.Empresa,
          this.DataInsert.Imputacion
        );
        this.DataInsert.UsoBien = "";
        this.DataInsert.Espf = "";
        if (this.DataInsert.Almacen != undefined) {
          this.getAllAlmacen(this.DataInsert.Plaza);
        }
      } else {
        this.toast.setMessage(
          "Los campos Habilitados son requeridos, por favor valida la informacion",
          "danger"
        );
      }
    }

    if (this.DataInsert.Imputacion.IdTipoSolicitud == 6) {
      //  console.log(this.Producto.CentroCosto);
      //  console.log(this.SelectedOInvercion);
      //  console.log(this.Producto.CuentaMayor);
      //  console.log(this.Producto.Material);
      //  console.log(this.Producto.Almacen);
      //  console.log(this.Producto.GrupCompra);
      //  console.log(this.Producto.UnidadMedida);
      //  console.log(this.Producto.IdOrdenEstadistica);
      //  console.log(this.Producto.NumActivo);
      //  console.log(this.Producto.NumNeces);
      //  console.log(this.Producto.UsoProd );

      if (precio >= 30000) {
        const dialogRef = this.dialog.open(DialogInfoComponent);

        dialogRef.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`);
        });
      }
      if (
        this.Producto.CentroCosto != undefined &&
        this.SelectedOInvercion == undefined &&
        this.Producto.CuentaMayor != undefined &&
        this.Producto.Material == undefined &&
        this.Producto.Almacen == undefined &&
        this.Producto.GrupCompra != undefined &&
        this.Producto.UnidadMedida != undefined &&
        this.Producto.IdOrdenEstadistica != undefined &&
        this.Producto.NumActivo == undefined &&
        this.Producto.NumNeces != undefined &&
        this.Producto.UsoProd.length != 0 &&
        this.Producto.Espf.length != 0
      ) {
        this.Producto.UsoProd = this.RemoveCaracteresEpeciales(this.Producto.UsoProd);
        this.Producto.Espf = this.RemoveCaracteresEpeciales(this.Producto.Espf);
        //realizamos el push de el objeto de Producot en array de Productos
        this.DataInsert.Productos.push(this.Producto);
        if (this.DataInsert.Productos.length > 0) {
          this.BloqMoreItem = true;
          //this.AplicaCenCost = true;
          this.AplicaOrdInt = true;
          //this.AplicaCtaMayor = true;
        }
        console.log(this.Producto);
        //creamos un nuevo producto y vaciamos los campos de la interfaz.
        this.Producto = new Producto();
        this.DataInsert.Cantidad = 0;
        this.DataInsert.Precio = 1;
        this.price = " ";
        if (this.DataInsert.Almacen != undefined) {
          this.getAllAlmacen(this.DataInsert.Plaza);
        }
        if (this.DataInsert.Materiales != undefined) {
          this.getAllMateriales(this.DataInsert.Plaza, this.DataInsert.Almacen);
        }

        // if(this.DataInsert.Imputacion.IdTipoSolicitud == 2){
        //   this.getAllCuentasMayor(this.DataInsert.Empresa, this.DataInsert.Imputacion.Acronimo);
        // }else{
        //   this.getAllCuentasMayor(this.DataInsert.Empresa, '');
        // }

        this.getAllGrupoCompra(this.DataInsert.Empresa);
        var Material: String = " ";
        //this.getAllCentroCosto( this.DataInsert.Empresa, this.DataInsert.Plaza);
        // this.filteredCCostos = null;
        // this.filteredCMayor = null;

        this.getunidadMedida(Material);
        this.getAllActivo(this.DataInsert.Empresa);
        this.getAllNecesidad();
        this.DataInsert.CentroCostos = this.Producto.CentroCosto;
        //this.getAllCentroCosto( this.DataInsert.Empresa, this.DataInsert.Plaza);

        this.GetAllOrdenEstadistica(
          this.DataInsert.Empresa,
          this.DataInsert.Imputacion
        );
        this.DataInsert.UsoBien = "";
        this.DataInsert.Espf = "";
      } else {
        this.toast.setMessage(
          "Los campos Habilitados son requeridos, por favor valida la informacion",
          "danger"
        );
      }
    }

    if (this.DataInsert.Imputacion.IdTipoSolicitud == 7) {
      // console.log(this.Producto.CentroCosto);
      // console.log(this.SelectedOInvercion);
      // console.log(this.Producto.CuentaMayor);
      // console.log(this.Producto.Material);
      // console.log(this.Producto.Almacen);
      // console.log(this.Producto.GrupCompra);
      // console.log(this.Producto.UnidadMedida);
      // console.log(this.Producto.IdOrdenEstadistica);
      // console.log(this.Producto.NumActivo);
      // console.log(this.Producto.NumNeces);
      // this.Producto.UsoProd = this.RemoveCaracteresEpeciales(this.Producto.UsoProd);
      // this.Producto.Espf = this.RemoveCaracteresEpeciales(this.Producto.Espf);

      if (
        this.Producto.CentroCosto == undefined &&
        this.SelectedOInvercion == undefined &&
        this.Producto.CuentaMayor == undefined &&
        //&& this.Producto.Material == undefined
        //&& this.Producto.Almacen == undefined
        this.Producto.GrupCompra != undefined &&
        this.Producto.UnidadMedida != undefined &&
        // && this.Producto.IdOrdenEstadistica != undefined
        this.Producto.NumActivo == undefined &&
        this.Producto.NumNeces != undefined &&
        this.Producto.UsoProd.length != 0 &&
        this.Producto.Espf.length != 0
      ) {
        this.Producto.UsoProd = this.RemoveCaracteresEpeciales(this.Producto.UsoProd);
        this.Producto.Espf = this.RemoveCaracteresEpeciales(this.Producto.Espf);
        //realizamos el push de el objeto de Producot en array de Productos
        this.DataInsert.Productos.push(this.Producto);
        if (this.DataInsert.Productos.length > 0) {
          this.BloqMoreItem = true;
          //this.AplicaCenCost = true;
          this.AplicaOrdInt = true;
          //this.AplicaCtaMayor = true;
        }
        //console.log(this.Producto);
        //creamos un nuevo producto y vaciamos los campos de la interfaz.
        this.Producto = new Producto();
        this.DataInsert.Cantidad = 0;
        this.DataInsert.Precio = 1;
        this.price = " ";

        if (this.DataInsert.Materiales != undefined) {
          this.getAllMateriales(this.DataInsert.Plaza, this.DataInsert.Almacen);
        }

        // if(this.DataInsert.Imputacion.IdTipoSolicitud == 2){
        //   this.getAllCuentasMayor(this.DataInsert.Empresa, this.DataInsert.Imputacion.Acronimo);
        // }else{
        //   this.getAllCuentasMayor(this.DataInsert.Empresa, '');
        // }

        this.getAllGrupoCompra(this.DataInsert.Empresa);
        var Material: String = " ";
        //this.getAllCentroCosto( this.DataInsert.Empresa, this.DataInsert.Plaza);
        // this.filteredCCostos = null;
        // this.filteredCMayor = null;

        this.getunidadMedida(Material);
        this.getAllActivo(this.DataInsert.Empresa);
        this.getAllNecesidad();
        this.DataInsert.CentroCostos = this.Producto.CentroCosto;
        //this.getAllCentroCosto( this.DataInsert.Empresa, this.DataInsert.Plaza);

        this.GetAllOrdenEstadistica(
          this.DataInsert.Empresa,
          this.DataInsert.Imputacion
        );
        this.DataInsert.UsoBien = "";
        this.DataInsert.Espf = "";
        if (this.DataInsert.Almacen != undefined) {
          this.getAllAlmacen(this.DataInsert.Plaza);
        }
      } else {
        this.toast.setMessage(
          "Los campos Habilitados son requeridos, por favor valida la informacion",
          "danger"
        );
      }
    }
  }

  deleteProd(producto: Producto) {
    //console.log(producto);
    const pos = this.DataInsert.Productos.map((elem) => elem).indexOf(producto);
    //console.log("*/*/*/*/Elementos Restantes*/*/*/*/"+pos);
    this.DataInsert.Productos.splice(pos, 1);
    //si se elimina un item se elimina tambien su detalle de datos
    console.log(this.DataInsert.Productos.length);
    this.DataInsert.Productos.forEach((element) => {
      console.log(element);
    });
    if (
      this.DataInsert.Productos.length == 0 ||
      this.DataInsert.Productos.length == undefined
    ) {
      this.BloqMoreItem = false;
      if (this.DataInsert.Imputacion.IdTipoSolicitud == 1) {
        //ocultamos la Seleccion de Tipo de Solicitud por item
        //this.solpedforitem = false;
        //TIPO DE IMPUTACUION A -----se bloquearan Centro de Costos, Orden interna, Cta. Mayor
        this.AplicaCenCost = true;
        this.AplicaOrdInt = true;
        this.AplicaCtaMayor = true;
        this.AplicaMat = true;
        this.AplicaAlma = true;
        //this.AplicaCentro = false;
        this.AplicaNumActivo = false;
        //vaciando los Selects de Almacen y Materiales.
        this.ListAlmacen = undefined;
        this.ListMateriales = undefined;
      } else if (this.DataInsert.Imputacion.IdTipoSolicitud == 2) {
        //TIPO DE IMPUTACION F ----ninguno se bloquea y todos son obligatorios Centro de Costos, Orden interna, Cta. Mayor
        this.AplicaCenCost = true;
        this.AplicaOrdInt = false;
        this.AplicaCtaMayor = false;
        this.AplicaMat = true;
        this.AplicaAlma = true;
        //this.AplicaCentro = false;
        this.AplicaNumActivo = true;
        //vaciando los Selects de Almacen y Materiales.
        this.ListAlmacen = undefined;
        this.ListMateriales = undefined;
        //this.getAllPosiciones(this.DataInsert.Imputacion);
        //llamamos los metodos que dependen de un cambio para limpiar los registros
        // this.getAllCentroCosto(this.DataInsert.Empresa,this.DataInsert.Plaza);
        // this.getAllCuentasMayor(this.DataInsert.Empresa);
        // //cuando se seleccione este tipo de Solicitud se mandara a llamar metodo de unidad de medida para el llenado sin idmaterial
        // var Material: String = ' ' ;
        // this.getunidadMedida(Material);
      } else if (this.DataInsert.Imputacion.IdTipoSolicitud == 3) {
        //TIPO DE IMPUTCION K ------- solo se bloquea Orden Interna, y quedan como obligatorioCentro de Costos y Cta de mayor
        this.AplicaCenCost = false;
        this.AplicaOrdInt = true;
        this.AplicaCtaMayor = false;
        this.AplicaMat = true;
        this.AplicaAlma = true;
        //this.AplicaCentro = false;
        this.AplicaNumActivo = true;
        //vaciando los Selects de Almacen y Materiales.
        this.ListAlmacen = undefined;
        this.ListMateriales = undefined;
      } else if (this.DataInsert.Imputacion.IdTipoSolicitud == 4) {
        //TIPO DE SOLICITUD KF Servicios
        this.AplicaCenCost = true;
        this.AplicaOrdInt = true;
        this.AplicaCtaMayor = true;
        this.AplicaMat = true;
        this.AplicaAlma = true;
        this.AplicaNumActivo = true;
        this.ListAlmacen = undefined;
        this.ListMateriales = undefined;
        this.AplicaUMedida = true;
      } else if (this.DataInsert.Imputacion.IdTipoSolicitud == 5) {
        //TIPO DE IMPUTACION NORMAL ------- se bloquea centro de costos , orden interna, cta de mayor, almacen
        this.AplicaCenCost = true;
        this.AplicaOrdInt = true;
        this.AplicaCtaMayor = true;
        this.AplicaMat = false;
        this.AplicaAlma = false;
        //this.AplicaCentro = false;
        this.AplicaNumActivo = true;
      } else if (this.DataInsert.Imputacion.IdTipoSolicitud == 6) {
        //console.log("Borrando elemento de imputacion 77777");
        this.AplicaCenCost = false;
        this.AplicaOrdInt = true;
        this.isProduction = true;
        this.AplicaCtaMayor = false;
        this.AplicaMat = true;
        this.AplicaAlma = true;
        //this.AplicaCentro = false;
        this.AplicaNumActivo = true;
        //vaciando los Selects de Almacen y Materiales.
        //this.ListAlmacen = undefined;
        this.filteredMaterial = undefined;
        this.AplicaUsobien = false;

        this.getAllAlmacen(this.DataInsert.Plaza);
        //this.getAllMateriales(this.DataInsert.Plaza, this.DataInsert.Almacen);
        this.ListCmayor = undefined;
        this.filteredCMayor = undefined;
        this.getAllCuentasMayor(
          this.DataInsert.Empresa,
          this.DataInsert.Imputacion.Acronimo
        );
        this.getAllCentroCosto(this.DataInsert.Empresa, this.DataInsert.Plaza);
        this.getAllGrupoCompra(this.DataInsert.Empresa);
        this.GetAllOrdenEstadistica(
          this.DataInsert.Empresa,
          this.DataInsert.Imputacion
        );
        this.getunidadMedida("");
      } else if (this.DataInsert.Imputacion.IdTipoSolicitud == 7) {
        //console.log("validaciones para el tipo de sol ped 7");
        this.AplicaCenCost = true;
        this.AplicaOrdInt = true;
        this.AplicaCtaMayor = true;
        this.AplicaMat = true;
        this.AplicaAlma = true;
        this.AplicaNumActivo = true;
        this.ListAlmacen = undefined;
        this.ListMateriales = undefined;
        this.AplicaUMedida = true;
      }
    }
    //this.toast.setMessage('item deleted successfully.', 'success');
  }
  //fin de los metoso para poder agregar o eliminar materiales o servicios

  buscaIdAutorizador(idarea: Area) {
    this.solicitudComp.getIdAutorizador(idarea.IdDireccion).subscribe(
      (data) => {
        //console.log(data);
        this.ListUser = data;
        this.DataInsert.Autorizador = this.ListUser[0];
      },
      (error) => {
        if(error.status == 403 || error.status == 404){
          this.toast.setMessage(
            error.message,
            "danger"
          );
          this.auth.logout();
        }
        console.log("error al recuperar usuario autorizador" + error)
      }
    );
  }

  //------------------------------------------------------------------Seccion de Hijos-------------------------------------------------------*/
  viewHijosProduct(producto: Producto) {
    //console.log("Dentro del metodo para mostrar ventana para agregar Hijos de un ITEM");
    this.SolPedView = false;
    this.AddDataProduct = true;
    const pos = this.DataInsert.Productos.map((elem) => elem).indexOf(producto);
    this.DataInsert.Productos.length;
    //console.log("----" + pos +"   "+ this.DataInsert.Productos.length);
    this.ChildsProduct.IdItem = pos + 1;
    this.posicionPadre = pos + 1;
    /*buscamos los Hijos por Item Seleccionado*/
    this.DataInsert.Productos.forEach((element) => {
      if (this.posicionPadre == element.IdPrduct) {
        //element.ChildProducts = this.Childs;
        this.Childs = element.ChildsProducts;
        console.log(this.Childs.length);
        // if(this.Childs.length  == element.Cantidad){
        //   console.log("entrando a la validacion");
        //   this.NoMoreData = true;
        // }
      }
      // element.CantidadChild = this.ChildsProduct.Cantidad;
      // element.PrecioChild = this.ChildsProduct.Precio;
      // element.IdOrdenEstadisticaChild = this.ChildsProduct.IdOrdenEstadisticaChild;
      // element.NameOrdenEstadistica = this.ChildsProduct.NameOrdenEstadisticaChild;
      // element.IdCentroCostoChild = this.ChildsProduct.IdCentroCostoChild;
      // element.NameCentroCostoChild = this.ChildsProduct.CentroCostoNameChild;
      // element.IdCuentaMayorChild = this.ChildsProduct.IdCuentaMayorChild;
      // element.NameCuentaMayorChild = this.ChildsProduct.NameCuentaMayorChild;

      console.log(element.ChildsProducts);
      console.log(this.Childs);
    });
  }
  //metodo para modifica rle precio del Hijo
  changePriceChil(value: string) {
    //console.log("se cambio el valor del Precio----->" + value);
    let priceint = parseFloat(value);
    this.ChildsProduct.Precio = priceint; //--> pasamos el precio convertido a entero a la variable del objeto
    //console.log("valor en variable del modelo-->" + this.DataInsert.Precio);
    if (Number.isNaN(priceint)) {
      priceint = 0;
      this.priceChild = "";
    } else {
      this.priceChild = formatCurrency(
        priceint,
        "en-US",
        getCurrencySymbol("USD", "wide")
      );
      this.ChildsProduct.PrecioView = formatCurrency(
        priceint,
        "en-US",
        getCurrencySymbol("USD", "wide")
      );
    }
  }

  /*datos de los Items Hijos */
  SelectedOrdenEstadisiticaChilds() {
    // console.log("dentro de Orden estadistica para Hijo");
    // console.log(this.SelectedOrEstChild.IdOrdenInterna);
    // console.log(this.SelectedOrEstChild.NombreOrder);
    /*Se pasan los datos seleeccionados a una varibale para validacion en VIsta*/
    this.SelectedOrdenEstaHijo = this.SelectedOrEstChild;
    /*Se crea variable en Modelo Principal y se iguala al valor seleccionado para su validacion del lado del server */
    this.DataInsert.SelectedOEstadisiticaChild = this.SelectedOrEstChild;
    /*Se pasan los datos a arreglo de Informacion para Mostrarse en la Vista (Lista de Detalle de Items) */
    this.ChildsProduct.IdOrdenEstadisticaChild = this.SelectedOrEstChild.IdOrdenInterna;
    this.ChildsProduct.NameOrdenEstadisticaChild = this.SelectedOrEstChild.NombreOrder;
  }

  SelectdCentrodeCostoChild() {
    // console.log("dentro de centro de cosotos para Hijo");
    // console.log(this.SelectedCostosChild.IdCentroCosto);
    // console.log(this.SelectedCostosChild.Nombre);
    /*Se pasan los datos seleeccionados a una varibale para validacion en VIsta*/
    this.SelectCentroCostosHijo = this.SelectedCostosChild;
    /*Se crea variable en Modelo Principal y se iguala al valor seleccionado para su validacion del lado del server */
    this.DataInsert.SelectedCentroCosotosChild = this.SelectedCostosChild;
    /*Se pasan los datos a arreglo de Informacion para Mostrarse en la Vista (Lista de Detalle de Items) */
    this.ChildsProduct.IdCentroCostoChild = this.SelectedCostosChild.IdCentroCosto;
    this.ChildsProduct.CentroCostoNameChild = this.SelectedCostosChild.Nombre;
  }

  SelectedCuentaMayorChild() {
    // console.log("dentro de Cuneta de mayor para Hijo");
    // console.log(this.SelectedCMayorChild.IdCuentaMayor);
    // console.log(this.SelectedCMayorChild.Nombre);
    /*Se pasan los datos seleeccionados a una varibale para validacion en VIsta*/
    this.SelectedCMayorHijo = this.SelectedCMayorChild;
    /*Se crea variable en Modelo Principal y se iguala al valor seleccionado para su validacion del lado del server */
    this.DataInsert.SelectedCuentaMayorChild = this.SelectedCMayorChild;
    /*Se pasan los datos a arreglo de Informacion para Mostrarse en la Vista (Lista de Detalle de Items) */
    this.ChildsProduct.IdCuentaMayorChild = this.SelectedCMayorChild.IdCuentaMayor;
    this.ChildsProduct.NameCuentaMayorChild = this.SelectedCMayorChild.Nombre;
  }

  SelectunidadMedidaChild() {
    // console.log("dentro de la unidad de medida");
    // console.log(this.SelectedUMedidaChild.IdUnidadMedida);
    // console.log(this.SelectedUMedidaChild.NombreUnidadMedida);
    this.ChildsProduct.IdUMedidaChild = this.SelectedUMedidaChild.IdUnidadMedida;
    this.ChildsProduct.NameUMedidaChild = this.SelectedUMedidaChild.NombreUnidadMedida;
  }

  /* metosod de los datos de los items Hijos*/
  addProductosChilds() {
    console.log("estos son los valores de los Hijos");
    console.log(this.ChildsProduct.Cantidad);
    console.log(this.ChildsProduct.Precio);
    console.log(this.ChildsProduct.IdUMedidaChild);
    console.log(this.ChildsProduct.NameUMedidaChild);
    console.log(this.ChildsProduct.IdOrdenEstadisticaChild);
    console.log(this.ChildsProduct.NameOrdenEstadisticaChild);
    console.log(this.ChildsProduct.IdCentroCostoChild);
    console.log(this.ChildsProduct.CentroCostoNameChild);
    console.log(this.ChildsProduct.IdCuentaMayorChild);
    console.log(this.ChildsProduct.NameCuentaMayorChild);
    this.ChildsProduct.TextoServicio = this.RemoveCaracteresEpeciales(
      this.ChildsProduct.TextoServicio
    ); //quitamos caracteres especiales con la exprecion regular

    console.log(this.DataInsert.Imputacion.IdTipoSolicitud);
    if (this.ChildsProduct.TextoServicio.length <= 40) {
      if (this.DataInsert.Imputacion.IdTipoSolicitud == 4) {
        console.log("dentro del if de servicios");
        if (
          this.ChildsProduct.Cantidad != undefined &&
          this.ChildsProduct.Precio != undefined &&
          this.ChildsProduct.IdUMedidaChild != undefined &&
          this.ChildsProduct.NameUMedidaChild != undefined &&
          this.ChildsProduct.IdCentroCostoChild != undefined &&
          this.ChildsProduct.CentroCostoNameChild != undefined &&
          this.ChildsProduct.IdCuentaMayorChild != undefined &&
          this.ChildsProduct.NameCuentaMayorChild != undefined &&
          this.ChildsProduct.TextoServicio != undefined
        ) {
          this.DataInsert.Productos.forEach((element) => {
            if (this.posicionPadre == element.IdPrduct) {
              //Se realiza la carga de Hijos validando que el item recorrido sea igual al item padre
              element.ChildsProducts.push(this.ChildsProduct);
            }

            this.Childs = element.ChildsProducts;
            console.log(element.ChildsProducts);
            console.log(this.Childs);
          });

          console.log(this.DataInsert.Productos);
          this.ChildsProduct = new ProductoHijos();

          this.ChildsProduct.IdItem = this.posicionPadre;
          this.ChildsProduct.Cantidad = 0;
          this.priceChild = "";
          this.ChildsProduct.Precio = 0;
          this.getunidadMedida("");
          this.GetAllOrdenEstadistica(
            this.DataInsert.Empresa,
            this.DataInsert.Imputacion
          );
          this.getAllCentroCosto(
            this.DataInsert.Empresa,
            this.DataInsert.Plaza
          );
          this.getAllCuentasMayor(this.DataInsert.Empresa, "");
        } else {
          this.toast.setMessage(
            "Los campos habilitados para este tipo de Solicitud no pueden ir vacios por favor revisa la infromacion e intenta de nuevo",
            "warning"
          );
        }
      } else if (this.DataInsert.Imputacion.IdTipoSolicitud == 7) {
        if (
          this.ChildsProduct.Cantidad != undefined &&
          this.ChildsProduct.Precio != undefined &&
          this.ChildsProduct.IdUMedidaChild != undefined &&
          this.ChildsProduct.IdOrdenEstadisticaChild != undefined &&
          this.ChildsProduct.NameOrdenEstadisticaChild != undefined &&
          this.ChildsProduct.NameUMedidaChild != undefined &&
          this.ChildsProduct.IdCentroCostoChild != undefined &&
          this.ChildsProduct.CentroCostoNameChild != undefined &&
          this.ChildsProduct.IdCuentaMayorChild != undefined &&
          this.ChildsProduct.NameCuentaMayorChild != undefined &&
          this.ChildsProduct.TextoServicio != undefined
        ) {
          this.DataInsert.Productos.forEach((element) => {
            // if(element.ChildsProducts.length === element.Cantidad){
            //     console.log("no se pueden agregar mas tatos de los espesificados");
            //     this.toast.setMessage('No se pueden agregar mas Datos los espesificados', 'warning');
            //     this.NoMoreData = true;
            // }else{

            // }
            if (this.posicionPadre == element.IdPrduct) {
              //Se realiza la carga de Hijos validando que el item recorrido sea igual al item padre
              element.ChildsProducts.push(this.ChildsProduct);
            }

            this.Childs = element.ChildsProducts;
            // console.log(element.ChildsProducts);
            // console.log(this.Childs);
          });

          console.log(this.DataInsert.Productos);
          this.ChildsProduct = new ProductoHijos();

          this.ChildsProduct.IdItem = this.posicionPadre;
          this.ChildsProduct.Cantidad = 0;
          this.priceChild = "";
          this.ChildsProduct.Precio = 0;
          this.getunidadMedida("");
          this.GetAllOrdenEstadistica(
            this.DataInsert.Empresa,
            this.DataInsert.Imputacion
          );
          this.getAllCentroCosto(
            this.DataInsert.Empresa,
            this.DataInsert.Plaza
          );
          this.getAllCuentasMayor(this.DataInsert.Empresa, "");
        } else {
          this.toast.setMessage(
            "Los campos habilitados para este tipo de Solicitud no pueden ir vacios por favor revisa la infromacion e intenta de nuevo",
            "warning"
          );
        }
      } else {
        this.ChildsProduct.IdItem = this.posicionPadre;
        this.ChildsProduct.Cantidad = 0;
        this.priceChild = "";
        this.ChildsProduct.Precio = 0;
        this.getunidadMedida("");
        this.GetAllOrdenEstadistica(
          this.DataInsert.Empresa,
          this.DataInsert.Imputacion
        );
        this.getAllCentroCosto(this.DataInsert.Empresa, this.DataInsert.Plaza);
        this.getAllCuentasMayor(this.DataInsert.Empresa, "");
      }
    } else {
      this.toast.setMessage(
        "El valor de Texto de Servico no puede superar los 40 caracteres, por favor modificar los datos",
        "warning"
      );
    }
  }

  deleteChils(hijo: ProductoHijos) {
    console.log(hijo);
    this.DataInsert.Productos.forEach((element) => {
      var pos = element.ChildsProducts.map((elem) => elem).indexOf(hijo);
      console.log(pos);
      element.ChildsProducts.splice(pos, 1);
      this.Childs = element.ChildsProducts;
      if (element.ChildsProducts.length < element.Cantidad) {
        this.NoMoreData = false;
      }
    });
  }

  FinAddhijos(producto: Producto) {
    console.log(this.Childs);
    console.log(producto);
    this.Childs = [];
    this.SolPedView = true;
    this.AddDataProduct = false;
    this.NoMoreData = false;
  }
  /*--------------------------------------------------------Fin de Seccion de Hijos------------------------------------------------------------*/

  TipoSolPedido: number;
  ValidacionCampos() {
    // console.log("Este es el total de productos que tiene    " +  this.DataInsert.Productos.length);
    // console.log("***********" + this.DataInsert.Area);
    // console.log("Usuario-->" + this.usr.value + "   " + this.usr.status);
    // console.log("puesto -->" + this.puesto.value + "  " + this.puesto.status);
    // console.log("Email-->" + this.email.value + " " + this.email.status);
    // console.log("Tel-->" +this.tel.value +"   "+ this.tel.status);
    // console.log("ext-->" + this.ext.value + "   " + this.ext.status);
    // console.log("Area-->" + this.DataInsert.Area.Nombre);
    // console.log("Empresa-->" + this.DataInsert.Empresa.Butxt);
    // console.log("Plaza-->" + this.DataInsert.Plaza.Nombre);
    // console.log("Tipo Solicitud-->" + this.DataInsert.Imputacion.Nombre);
    // console.log("Centro de costo-->" + this.DataInsert.CentroCostos);
    // console.log("Orden Interna-->" + this.DataInsert.OrdenInterna);
    // console.log("Cuenta de mayor-->" + this.DataInsert.Cuentamayor);
    // console.log("Categorias --->" + this.DataInsert.Categoria)
    //console.log("Producto-->" + this.DataInsert.Productos);
    this.buscaIdAutorizador(this.DataInsert.Area);
    this.uploader.progress = 0;
    //console.log(this.uploader.queue[0]._file.name);
    //console.log(this.uploader.queue.length);
    if (
      this.Date.value == "" ||
      this.usr.status === "INVALID" ||
      this.usr.value == "" ||
      this.puesto.status === "INVALIDO" ||
      this.puesto.value == "" ||
      this.email.status === "INVALID" ||
      this.email.value == "" ||
      this.tel.status === "INVALID" ||
      this.tel.value == "" ||
      this.ext.status === "INVALID" ||
      this.ext.value == "" ||
      this.DataInsert.Area === undefined ||
      this.DataInsert.Empresa === undefined ||
      this.DataInsert.Plaza === undefined ||
      this.DataInsert.Moneda === undefined ||
      this.DataInsert.Imputacion === undefined ||
      this.DataInsert.Justificacion === undefined 

      //  || this.DataInsert.Posicion === undefined
      //|| this.DataInsert.Tipo === undefined
      //|| this.DataInsert.CentroCostos === undefined
      //|| this.DataInsert.IdOrdenInterna === undefined
      //  || this.DataInsert.Cuentamayor === undefined
      //  || this.DataInsert.Almacen === undefined
      //  || this.DataInsert.GArticulo === undefined
      //  || this.DataInsert.GCompra === undefined
    ) {
      this.toast.setMessage(
        "Los Campos de Usuario y Datos Generales son requeridos, Revisar Informacion",
        "warning"
      );
    } else {
      //this.uploader._fileSizeFilter;
      //this.uploader._fileTypeFilter;
      if (this.uploader.queue.length == 1) {
        var requierente = this.RemoveCaracteresEpeciales(this.usr.value);
        this.usr.setValue(requierente);
        var justificacion = this.RemoveCaracteresEpeciales(this.DataInsert.Justificacion);
        this.DataInsert.Justificacion = justificacion;
        console.log("good");
        if (this.DataInsert.Productos.length != 0) {
          console.log("porlomenos tiene un item la Solicitud");
          if (this.DataInsert.Imputacion.IdTipoSolicitud == 1) {
            // console.log("se cumple la condicion------------1-------------------" +
            // this.SelectedCostos + "-------------Cecos"
            // +this.SelectedOInvercion+"-------------- OrdenINv"+
            // this.SelectedCMayor+"----- Cuneta MAyor"+
            // this.DataInsert.GCompra + "----- Grupo COmpora"+
            // this.DataInsert.UMedida + "----- Unidad Medida"+
            // this.DataInsert.NActivo + "----- Necesidad"+
            // this.DataInsert.Necesidad + "----- Uso Bien"+
            // this.DataInsert.UsoBien + "----- Espesificacion"+
            // this.DataInsert.Espf + "-----------Justificacion"+
            // this.DataInsert.Justificacion);

            this.DataInsert.CentroCostos = this.SelectedCostos;
            this.DataInsert.OrdenInterna = this.SelectedOInvercion;
            this.DataInsert.Cuentamayor = this.SelectedCMayor;

            if (
              this.SelectedCostos == undefined &&
              this.SelectedOInvercion == undefined &&
              this.SelectedCMayor == undefined
              // && this.DataInsert.GCompra != undefined
              // && this.DataInsert.UMedida != undefined
              // && this.DataInsert.NActivo != undefined
              // && this.DataInsert.Necesidad != undefined
              // && this.DataInsert.UsoBien != undefined
              // && this.DataInsert.Espf != undefined
            ) {
              console.log("***********");
              console.log(this.DataInsert.Area.IdDireccion);
              this.DataInsert.CentroCostos = this.SelectedCostos;
              this.DataInsert.OrdenInterna = this.SelectedOInvercion;
              this.DataInsert.Cuentamayor = this.SelectedCMayor;

              this.DataInsert.Fecha = this.date;
              this.DataInsert.Usr = this.usr.value;
              this.DataInsert.Puesto = this.puesto.value;
              this.DataInsert.Email = this.email.value;
              this.DataInsert.Tel = this.tel.value;
              this.DataInsert.Ext = this.ext.value;
              this.DataInsert.IdUsuario = this.auth.currentUser.IdUsuario;
              this.DataInsert.NombreProduccion = this.nombreProduccion.value;
              console.log("este es un tipo de solicitud --IMP A--");
              //primero Validamos si tenemos alguna exclucion de autorizacion
              var Role;
              var status;
              this.solicitudComp
                .checkdirauthexeption(this.DataInsert.Area.IdDireccion)
                .subscribe(
                  (data) => {
                    if (data[0] != undefined || data[0] != null) {
                      console.log("Validando infromacion de envio");
                      if (data[0].IdRole == 2) {
                        console.log("Se excluye de la autorizacion a GERENTE");
                        Role = data[0].IdRole + 1;
                        status = data[0].IdRole;
                        this.DataInsert.TipoSolicitud = 1;
                        this.DataInsert.EstatusSol = status; //se igual el satus al role por que es igual al de Autorizada por Gerente para que lo visualice Director
                        this.solicitudComp
                          .InsertSolicitudPedido1(this.DataInsert)
                          .subscribe(
                            (res) => {
                              console.log(
                                "??????????????????????????????????????"
                              );
                              console.log(res);
                              console.log(
                                "??????????????????????????????????????"
                              );
                              //console.log(this.DataInsert.Area.IdDireccion);
                              this.IdSoliforFile = res;
                              //envio de archivo de precotizacion-----------------------
                              this.uploader.options.headers = [];
                              this.uploader.options.headers.push({
                                name: "IdSol",
                                value: this.IdSoliforFile.toString(),
                              });
                              this.uploader.options.removeAfterUpload.valueOf();
                              this.uploader.setOptions(this.uploader);
                              this.uploader.uploadAll();
                              //fin de envio de archivo ---------------------------------

                              console.log(Role);
                              console.log(status);
                              console.log(this.DataInsert.Area.IdDireccion);
                              var Solicitante = this.DataInsert.Usr;
                              var IdDIreccion = this.DataInsert.Area
                                .IdDireccion;
                              var NombreDir = this.DataInsert.Area.Nombre;
                              this.solicitudComp
                                .getUserAutorizador(
                                  this.DataInsert.Area.IdDireccion,
                                  Role
                                )
                                .subscribe(
                                  (data) => {
                                    this.UsrAuthEmail = data;
                                    console.log(
                                      "------------------------------"
                                    );
                                    console.log(this.UsrAuthEmail[0]);
                                    console.log(
                                      "------------------0------------"
                                    );
                                    console.log(
                                      "Id de la DIreccion a enviar correo" +
                                        IdDIreccion
                                    );
                                    console.log(
                                      "Nombre de la DIrecion a la que se enviara mail--->" +
                                        NombreDir
                                    );
                                    this.toast.setMessage(
                                      "Envio de Solicitud Correcto. ",
                                      "success"
                                    );
                                    this.uploader.clearQueue();
                                    //si no se ha enviado a guardar la SolPed a la base de datos el boton de subir cotizacion quedara inhablilitado
                                    this.isEnviadoSolPed = false;
                                    this.uploader = new FileUploader({
                                      url: URL,
                                      itemAlias: " ",
                                    });

                                    this.ngOnInit();
                                    //si se guardo la Solicitud limpiamos los registros
                                    this.date = "";
                                    this.usr.reset();
                                    this.puesto.reset();
                                    this.email.reset();
                                    this.tel.reset();
                                    this.ext.reset();
                                    this.nombreProduccion.reset();
                                    this.ngOnInit();
                                    this.addProdForm.reset();
                                    this.BloqMoreItem = false;
                                    var SendStatusMailAutorizacion = 4; //este numero cuatro se ponodra en el boton de autorizar para saber que autoriza direccion a nivel mail.
                                    var SendStatusmailRechazo = 5; //este numero se pondra en el boton de rechaar para saber que el directore rechaza la nueva solicitud desde el mail.
                                    //esta parte es para el envio de correo para el dir de area.
                                    this.solicitudComp
                                      .SendEmailNewSolicitud(
                                        res,
                                        status,
                                        IdDIreccion,
                                        NombreDir,
                                        Solicitante,
                                        this.UsrAuthEmail[0].IdRole,
                                        this.UsrAuthEmail[0].NombreCompleto,
                                        this.UsrAuthEmail[0].Email,
                                        SendStatusMailAutorizacion,
                                        SendStatusmailRechazo
                                      )
                                      .subscribe(
                                        (res) => {
                                          console.log(res);
                                          this.toast.setMessage(
                                            "Se realizo el envio del Email a Dir de Area",
                                            "success"
                                          );
                                        },
                                        (error) => {
                                          if(error.status == 403 || error.status == 404){
                                            this.toast.setMessage(
                                              error.message,
                                              "danger"
                                            );
                                            this.auth.logout();
                                          }
                                          console.log(error);
                                          //this.toast.setMessage('Error en el envio de el Correo','success');
                                        }
                                      );
                                  },
                                  (error) => {
                                    if(error.status == 403 || error.status == 404){
                                      this.toast.setMessage(
                                        error.message,
                                        "danger"
                                      );
                                      this.auth.logout();
                                    }
                                    console.log(
                                      "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                                        error
                                    );
                                  }
                                );
                            },
                            (error) => {
                              this.isEnviadoSolPed = false;
                               if(error.status == 403 || error.status == 404){
                                  this.toast.setMessage(
                                    error.message,
                                    "danger"
                                  );
                                  this.auth.logout();
                                }
                              this.toast.setMessage(error.message, "danger");
                            }
                          );
                      } else if (data[0].IdRole == 3) {
                        console.log(
                          "Se excluye dde la autorizaciones a DIRECTOR o SUBDIRECTOR"
                        );
                        Role = data[0].IdRole - 1;
                        status = data[0].IdRole - 2;
                        this.DataInsert.TipoSolicitud = 1;
                        this.DataInsert.EstatusSol = status;
                        this.solicitudComp
                          .InsertSolicitudPedido1(this.DataInsert)
                          .subscribe(
                            (res) => {
                              console.log(
                                "??????????????????????????????????????"
                              );
                              console.log(res);
                              console.log(
                                "??????????????????????????????????????"
                              );
                              //console.log(this.DataInsert.Area.IdDireccion);
                              this.IdSoliforFile = res;
                              //envio de archivo de precotizacion-----------------------
                              this.uploader.options.headers = [];
                              this.uploader.options.headers.push({
                                name: "IdSol",
                                value: this.IdSoliforFile.toString(),
                              });
                              this.uploader.options.removeAfterUpload.valueOf();
                              this.uploader.setOptions(this.uploader);
                              this.uploader.uploadAll();
                              //fin de envio de cotizacion -----------------------------

                              console.log(Role);
                              console.log(status);
                              console.log(this.DataInsert.Area.IdDireccion);
                              var Solicitante = this.DataInsert.Usr;
                              var IdDIreccion = this.DataInsert.Area
                                .IdDireccion;
                              var NombreDir = this.DataInsert.Area.Nombre;
                              this.solicitudComp
                                .getUserAutorizador(
                                  this.DataInsert.Area.IdDireccion,
                                  Role
                                )
                                .subscribe(
                                  (data) => {
                                    this.UsrAuthEmail = data;
                                    console.log(
                                      "------------------------------"
                                    );
                                    console.log(this.UsrAuthEmail[0]);
                                    console.log(
                                      "------------------0------------"
                                    );
                                    console.log(
                                      "Id de la DIreccion a enviar correo" +
                                        IdDIreccion
                                    );
                                    console.log(
                                      "Nombre de la DIrecion a la que se enviara mail--->" +
                                        NombreDir
                                    );
                                    this.toast.setMessage(
                                      "Envio de Solicitud Correcto. ",
                                      "success"
                                    );
                                    this.uploader.clearQueue();
                                    //si no se ha enviado a guardar la SolPed a la base de datos el boton de subir cotizacion quedara inhablilitado
                                    this.isEnviadoSolPed = false;
                                    this.uploader = new FileUploader({
                                      url: URL,
                                      itemAlias: " ",
                                    });

                                    this.ngOnInit();
                                    //si se guardo la Solicitud limpiamos los registros
                                    this.date = "";
                                    this.usr.reset();
                                    this.puesto.reset();
                                    this.email.reset();
                                    this.tel.reset();
                                    this.ext.reset();
                                    this.nombreProduccion.reset();
                                    this.ngOnInit();
                                    this.addProdForm.reset();
                                    this.BloqMoreItem = false;
                                    var SendStatusMailAutorizacion = 0; //este numero cuatro se ponodra en el boton de autorizar para saber que autoriza direccion a nivel mail.
                                    var SendStatusmailRechazo = 0; //este numero se pondra en el boton de rechaar para saber que el directore rechaza la nueva solicitud desde el mail.
                                    //esta parte es para el envio de correo para el dir de area.
                                    this.solicitudComp
                                      .SendEmailNewSolicitud(
                                        res,
                                        status,
                                        IdDIreccion,
                                        NombreDir,
                                        Solicitante,
                                        this.UsrAuthEmail[0].IdRole,
                                        this.UsrAuthEmail[0].NombreCompleto,
                                        this.UsrAuthEmail[0].Email,
                                        SendStatusMailAutorizacion,
                                        SendStatusmailRechazo
                                      )
                                      .subscribe(
                                        (res) => {
                                          console.log(res);
                                          this.toast.setMessage(
                                            "Se realizo el envio del Email a Dir de Area",
                                            "success"
                                          );
                                        },
                                        (err) => {
                                          console.log(err);
                                          //this.toast.setMessage('Error en el envio de el Correo','success');
                                        }
                                      );
                                  },
                                  (err) => {
                                    console.log(
                                      "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                                        err
                                    );
                                  }
                                );
                            },
                            (error) => {
                              this.isEnviadoSolPed = false;
                              console.log(error);
                              this.toast.setMessage(
                                "Ocurrio un Problema al Guardar tu Solicitud. Intenta de nuevo por favor ",
                                "danger"
                              );
                            }
                          );
                      }
                    } else {
                      console.log(
                        "entrando al else para seguir el flujo normal de la solicitud"
                      );
                      this.DataInsert.TipoSolicitud = 1;
                      this.DataInsert.EstatusSol = 1;
                      this.solicitudComp
                        .InsertSolicitudPedido1(this.DataInsert)
                        .subscribe(
                          (res) => {
                            console.log(
                              "??????????????????????????????????????"
                            );
                            console.log(res);
                            console.log(
                              "??????????????????????????????????????"
                            );
                            //console.log(this.DataInsert.Area.IdDireccion);
                            this.IdSoliforFile = res;
                            this.uploader.options.headers = [];
                            this.uploader.options.headers.push({
                              name: "IdSol",
                              value: this.IdSoliforFile.toString(),
                            });
                            this.uploader.options.removeAfterUpload.valueOf();
                            this.uploader.setOptions(this.uploader);
                            this.uploader.uploadAll();
                            Role = 2;
                            status = 1;
                            console.log(Role);
                            console.log(status);
                            console.log(this.DataInsert.Area.IdDireccion);
                            var Solicitante = this.DataInsert.Usr;
                            var IdDIreccion = this.DataInsert.Area.IdDireccion;
                            var NombreDir = this.DataInsert.Area.Nombre;
                            this.solicitudComp
                              .getUserAutorizador(
                                this.DataInsert.Area.IdDireccion,
                                Role
                              )
                              .subscribe(
                                (data) => {
                                  this.UsrAuthEmail = data;
                                  console.log("------------------------------");
                                  console.log(this.UsrAuthEmail[0]);
                                  console.log(
                                    "------------------0------------"
                                  );
                                  console.log(
                                    "Id de la DIreccion a enviar correo" +
                                      IdDIreccion
                                  );
                                  console.log(
                                    "Nombre de la DIrecion a la que se enviara mail--->" +
                                      NombreDir
                                  );
                                  this.toast.setMessage(
                                    "Envio de Solicitud Correcto. ",
                                    "success"
                                  );
                                  //si no se ha enviado a guardar la SolPed a la base de datos el boton de subir cotizacion quedara inhablilitado
                                  this.uploader.clearQueue();
                                    //si no se ha enviado a guardar la SolPed a la base de datos el boton de subir cotizacion quedara inhablilitado
                                    this.isEnviadoSolPed = false;
                                    this.uploader = new FileUploader({
                                      url: URL,
                                      itemAlias: " ",
                                    });
                                  this.ngOnInit();
                                  //si se guardo la Solicitud limpiamos los registros
                                  this.date = "";
                                  this.usr.reset();
                                  this.puesto.reset();
                                  this.email.reset();
                                  this.tel.reset();
                                  this.ext.reset();
                                  this.nombreProduccion.reset();
                                  this.ngOnInit();
                                  this.addProdForm.reset();
                                  this.BloqMoreItem = false;
                                  var SendStatusMailAutorizacion = 0; //este numero cuatro se ponodra en el boton de autorizar para saber que autoriza direccion a nivel mail.
                                  var SendStatusMailRechazo = 0; //este numero se pondra en el boton de rechaar para saber que el directore rechaza la nueva solicitud desde el mail.
                                  //esta parte es para el envio de correo para el dir de area.
                                  this.solicitudComp
                                    .SendEmailNewSolicitud(
                                      res,
                                      status,
                                      IdDIreccion,
                                      NombreDir,
                                      Solicitante,
                                      this.UsrAuthEmail[0].IdRole,
                                      this.UsrAuthEmail[0].NombreCompleto,
                                      this.UsrAuthEmail[0].Email,
                                      SendStatusMailAutorizacion,
                                      SendStatusMailRechazo
                                    )
                                    .subscribe(
                                      (res) => {
                                        console.log(res);
                                        this.toast.setMessage(
                                          "Se realizo el envio del Email a Dir de Area",
                                          "success"
                                        );
                                      },
                                      (err) => {
                                        //console.log("----ÑÑÑÑÑÑÑÑÑÑ");
                                        //location.reload();
                                        console.log(err);
                                        //this.toast.setMessage('Error en el envio de el Correo','success');
                                      }
                                    );
                                },
                                (err) => {
                                  console.log(
                                    "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                                      err
                                  );
                                }
                              );
                          },
                          (error) => {
                            this.isEnviadoSolPed = false;
                            console.log(error);
                            this.toast.setMessage(error.message, "danger");
                          }
                        );
                    }
                  },
                  (err) => {
                    console.log(
                      "error al recuperar la informacion de las Exxcepcions" +
                        err
                    );
                  }
                );
            } else {
              console.log("entra al else");
              this.toast.setMessage(
                "Los Campos Habilitados son requeridos Favor de Revisar la Informacion ",
                "danger"
              );
            }
          }

          if (this.DataInsert.Imputacion.IdTipoSolicitud == 2) {
            console.log(
              "se cumple la condicion-------------2------------------" +
                this.DataInsert.CentroCostos +
                "-------------" +
                this.DataInsert.OrdenInterna +
                "--------------" +
                this.DataInsert.Cuentamayor +
                "Slected CCostps" +
                this.SelectedCostos +
                "Selected Onrdern Inve --< " +
                this.SelectedOInvercion +
                "Selected Cuenta mayor -->" +
                this.SelectedCMayor
            );
            if (
              this.SelectedCostos == undefined &&
              this.SelectedOInvercion != undefined &&
              this.SelectedCMayor != undefined
              //&& valor.Material == undefined
              //&& valor.Almacen == undefined
              //&& this.Centro != undefined
              //&& valor.NumActivo == undefined
            ) {
              this.DataInsert.CentroCostos = this.SelectedCostos;
              this.DataInsert.OrdenInterna = this.SelectedOInvercion;
              this.DataInsert.Cuentamayor = this.SelectedCMayor;

              this.DataInsert.Fecha = this.date;
              this.DataInsert.Usr = this.usr.value;
              this.DataInsert.Puesto = this.puesto.value;
              this.DataInsert.Email = this.email.value;
              this.DataInsert.Tel = this.tel.value;
              this.DataInsert.Ext = this.ext.value;
              this.DataInsert.IdUsuario = this.auth.currentUser.IdUsuario;
              this.DataInsert.NombreProduccion = this.nombreProduccion.value;

              console.log("este es un tipo de solicitud --IMP F--");
              //primero Validamos si tenemos alguna exclucion de autorizacion
              var Role;
              var status;
              this.solicitudComp
                .checkdirauthexeption(this.DataInsert.Area.IdDireccion)
                .subscribe(
                  (data) => {
                    if (data[0] != undefined || data[0] != null) {
                      if (data[0].IdRole == 2) {
                        console.log("Se excluye de la autorizacion a GERENTE");
                        Role = data[0].IdRole + 1;
                        status = data[0].IdRole;
                        this.DataInsert.TipoSolicitud = 2;
                        this.DataInsert.EstatusSol = status; //se igual el satus al role por que es igual al de Autorizada por Gerente para que lo visualice Director
                        this.solicitudComp
                          .InsertSolicitudPedido1(this.DataInsert)
                          .subscribe(
                            (res) => {
                              console.log(
                                "??????????????????????????????????????"
                              );
                              console.log(res);
                              console.log(
                                "??????????????????????????????????????"
                              );
                              console.log(this.DataInsert.Area.IdDireccion);
                              this.IdSoliforFile = res;
                              //se envia parametro de IdSOlicitud para identificar correctamente la cotizacion
                              this.uploader.options.headers = [];
                              this.uploader.options.headers.push({
                                name: "IdSol",
                                value: this.IdSoliforFile.toString(),
                              });
                              this.uploader.setOptions(this.uploader);
                              this.uploader.uploadAll();
                              console.log(Role);
                              console.log(status);
                              console.log(this.DataInsert.Area.IdDireccion);
                              var Solicitante = this.DataInsert.Usr;
                              var IdDIreccion = this.DataInsert.Area
                                .IdDireccion;
                              var NombreDir = this.DataInsert.Area.Nombre;
                              this.solicitudComp
                                .getUserAutorizador(
                                  this.DataInsert.Area.IdDireccion,
                                  Role
                                )
                                .subscribe(
                                  (data) => {
                                    this.UsrAuthEmail = data;
                                    console.log(
                                      "------------------------------"
                                    );
                                    console.log(this.UsrAuthEmail[0]);
                                    console.log(
                                      "------------------0------------"
                                    );
                                    console.log(
                                      "Id de la DIreccion a enviar correo" +
                                        IdDIreccion
                                    );
                                    console.log(
                                      "Nombre de la DIrecion a la que se enviara mail--->" +
                                        NombreDir
                                    );
                                    this.toast.setMessage(
                                      "Envio de Solicitud Correcto. ",
                                      "success"
                                    );
                                    //si se guardo la Solicitud limpiamos los registros
                                    this.isEnviadoSolPed = false;
                                    this.date = "";
                                    this.usr.reset();
                                    this.puesto.reset();
                                    this.email.reset();
                                    this.tel.reset();
                                    this.ext.reset();
                                    this.nombreProduccion.reset();
                                    this.ngOnInit();
                                    this.addProdForm.reset();
                                    this.BloqMoreItem = false;
                                    var SendStatusMailAutorizacion = 4; //este numero cuatro se ponodra en el boton de autorizar para saber que autoriza direccion a nivel mail.
                                    var SendStatusMailRechazo = 5; //este numero se pondra en el boton de rechaar para saber que el directore rechaza la nueva solicitud desde el mail.
                                    //esta parte es para el envio de correo para el dir de area.
                                    this.solicitudComp
                                      .SendEmailNewSolicitud(
                                        res,
                                        status,
                                        IdDIreccion,
                                        NombreDir,
                                        Solicitante,
                                        this.UsrAuthEmail[0].IdRole,
                                        this.UsrAuthEmail[0].NombreCompleto,
                                        this.UsrAuthEmail[0].Email,
                                        SendStatusMailAutorizacion,
                                        SendStatusMailRechazo
                                      )
                                      .subscribe(
                                        (res) => {
                                          console.log(res);
                                          this.toast.setMessage(
                                            "Se realizo el envio del Email a Gerete de Area",
                                            "success"
                                          );
                                        },
                                        (error) => {
                                          if(error.status == 403 || error.status == 404){
                                            this.toast.setMessage(
                                              error.message,
                                              "danger"
                                            );
                                            this.auth.logout();
                                          }
                                          console.log(error);
                                          //this.toast.setMessage('Error en el envio de el Correo','success');
                                        }
                                      );
                                  },
                                  (error) => {
                                    if(error.status == 403 || error.status == 404){
                                      this.toast.setMessage(
                                        error.message,
                                        "danger"
                                      );
                                      this.auth.logout();
                                    }
                                    console.log(
                                      "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                                        error
                                    );
                                  }
                                );
                            },
                            (error) => {

                              this.isEnviadoSolPed = false;
                               if(error.status == 403 || error.status == 404){
                                  this.toast.setMessage(
                                    error.message,
                                    "danger"
                                  );
                                  this.auth.logout();
                                }
                              this.toast.setMessage(error.message, "danger");
                            }
                          );
                      } else if (data[0].IdRole == 3) {
                        console.log(
                          "Se excluye dde la autorizaciones a DIRECTOR o SUBDIRECTOR"
                        );
                        Role = data[0].IdRole - 1;
                        status = data[0].IdRole - 2;
                        this.DataInsert.TipoSolicitud = 1;
                        this.DataInsert.EstatusSol = status;
                        this.solicitudComp
                          .InsertSolicitudPedido1(this.DataInsert)
                          .subscribe(
                            (res) => {
                              console.log(
                                "??????????????????????????????????????"
                              );
                              console.log(res);
                              console.log(
                                "??????????????????????????????????????"
                              );
                              console.log(this.DataInsert.Area.IdDireccion);
                              this.IdSoliforFile = res;
                              //se envia parametro de IdSOlicitud para identificar correctamente la cotizacion
                              this.uploader.options.headers = [];
                              this.uploader.options.headers.push({
                                name: "IdSol",
                                value: this.IdSoliforFile.toString(),
                              });
                              this.uploader.setOptions(this.uploader);
                              this.uploader.uploadAll();
                              console.log(Role);
                              console.log(status);
                              console.log(this.DataInsert.Area.IdDireccion);
                              var Solicitante = this.DataInsert.Usr;
                              var IdDIreccion = this.DataInsert.Area
                                .IdDireccion;
                              var NombreDir = this.DataInsert.Area.Nombre;
                              this.solicitudComp
                                .getUserAutorizador(
                                  this.DataInsert.Area.IdDireccion,
                                  Role
                                )
                                .subscribe(
                                  (data) => {
                                    this.UsrAuthEmail = data;
                                    console.log(
                                      "------------------------------"
                                    );
                                    console.log(this.UsrAuthEmail[0]);
                                    console.log(
                                      "------------------0------------"
                                    );
                                    console.log(
                                      "Id de la DIreccion a enviar correo" +
                                        IdDIreccion
                                    );
                                    console.log(
                                      "Nombre de la DIrecion a la que se enviara mail--->" +
                                        NombreDir
                                    );
                                    this.toast.setMessage(
                                      "Envio de Solicitud Correcto. ",
                                      "success"
                                    );
                                    //si se guardo la Solicitud limpiamos los registros
                                    this.isEnviadoSolPed = false;
                                    this.date = "";
                                    this.usr.reset();
                                    this.puesto.reset();
                                    this.email.reset();
                                    this.tel.reset();
                                    this.ext.reset();
                                    this.nombreProduccion.reset();
                                    this.ngOnInit();
                                    this.addProdForm.reset();
                                    this.BloqMoreItem = false;
                                    var SendStatusMailAutorizacion = 0; //este numero cuatro se ponodra en el boton de autorizar para saber que autoriza direccion a nivel mail.
                                    var SendStatusMailRechazo = 0; //este numero se pondra en el boton de rechaar para saber que el directore rechaza la nueva solicitud desde el mail.
                                    //esta parte es para el envio de correo para el dir de area.
                                    this.solicitudComp
                                      .SendEmailNewSolicitud(
                                        res,
                                        status,
                                        IdDIreccion,
                                        NombreDir,
                                        Solicitante,
                                        this.UsrAuthEmail[0].IdRole,
                                        this.UsrAuthEmail[0].NombreCompleto,
                                        this.UsrAuthEmail[0].Email,
                                        SendStatusMailAutorizacion,
                                        SendStatusMailRechazo
                                      )
                                      .subscribe(
                                        (res) => {
                                          console.log(res);
                                          this.toast.setMessage(
                                            "Se realizo el envio del Email a Dir de Area",
                                            "success"
                                          );
                                        },
                                        (err) => {
                                          console.log(err);
                                          //this.toast.setMessage('Error en el envio de el Correo','success');
                                        }
                                      );
                                  },
                                  (err) => {
                                    console.log(
                                      "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                                        err
                                    );
                                  }
                                );
                            },
                            (error) => {
                              this.isEnviadoSolPed = false;
                              console.log(error);
                              this.toast.setMessage(
                                "Ocurrio un Problema al Guardar tu Solicitud. Intenta de nuevo por favor ",
                                "danger"
                              );
                            }
                          );
                      }
                    } else {
                      console.log(
                        "Se continua con el flujo normal de autoriaciones"
                      );
                      Role = 2;
                      status = 1;
                      this.DataInsert.TipoSolicitud = 2;
                      this.DataInsert.EstatusSol = status;
                      this.solicitudComp
                        .InsertSolicitudPedido1(this.DataInsert)
                        .subscribe(
                          (res) => {
                            console.log(
                              "??????????????????????????????????????"
                            );
                            console.log(res);
                            console.log(
                              "??????????????????????????????????????"
                            );
                            console.log(this.DataInsert.Area.IdDireccion);
                            this.IdSoliforFile = res;
                            //se envia parametro de IdSOlicitud para identificar correctamente la cotizacion
                            this.uploader.options.headers = [];
                            this.uploader.options.headers.push({
                              name: "IdSol",
                              value: this.IdSoliforFile.toString(),
                            });
                            this.uploader.setOptions(this.uploader);
                            this.uploader.uploadAll();
                            console.log(Role);
                            console.log(status);
                            console.log(this.DataInsert.Area.IdDireccion);
                            var Solicitante = this.DataInsert.Usr;
                            var IdDIreccion = this.DataInsert.Area.IdDireccion;
                            var NombreDir = this.DataInsert.Area.Nombre;
                            this.solicitudComp
                              .getUserAutorizador(
                                this.DataInsert.Area.IdDireccion,
                                Role
                              )
                              .subscribe(
                                (data) => {
                                  this.UsrAuthEmail = data;
                                  console.log("------------------------------");
                                  console.log(this.UsrAuthEmail[0]);
                                  console.log(
                                    "------------------0------------"
                                  );
                                  console.log(
                                    "Id de la DIreccion a enviar correo" +
                                      IdDIreccion
                                  );
                                  console.log(
                                    "Nombre de la DIrecion a la que se enviara mail--->" +
                                      NombreDir
                                  );
                                  this.toast.setMessage(
                                    "Envio de Solicitud Correcto. ",
                                    "success"
                                  );
                                  //si no se ha enviado a guardar la SolPed a la base de datos el boton de subir cotizacion quedara inhablilitado
                                  this.isEnviadoSolPed = false;
                                  this.ngOnInit();
                                  //si se guardo la Solicitud limpiamos los registros
                                  this.date = "";
                                  this.usr.reset();
                                  this.puesto.reset();
                                  this.email.reset();
                                  this.tel.reset();
                                  this.ext.reset();
                                  this.nombreProduccion.reset();
                                  this.ngOnInit();
                                  this.addProdForm.reset();
                                  this.BloqMoreItem = false;
                                  var SendStatusMailAutorizacion = 0; //este numero cuatro se ponodra en el boton de autorizar para saber que autoriza direccion a nivel mail.
                                  var SendStatusMailRechazo = 0; //este numero se pondra en el boton de rechaar para saber que el directore rechaza la nueva solicitud desde el mail.
                                  //esta parte es para el envio de correo para el dir de area.
                                  this.solicitudComp
                                    .SendEmailNewSolicitud(
                                      res,
                                      status,
                                      IdDIreccion,
                                      NombreDir,
                                      Solicitante,
                                      this.UsrAuthEmail[0].IdRole,
                                      this.UsrAuthEmail[0].NombreCompleto,
                                      this.UsrAuthEmail[0].Email,
                                      SendStatusMailAutorizacion,
                                      SendStatusMailRechazo
                                    )
                                    .subscribe(
                                      (res) => {
                                        console.log(res);
                                        this.toast.setMessage(
                                          "Se realizo el envio del Email a aotorizador de Area",
                                          "success"
                                        );
                                      },
                                      (err) => {
                                        console.log(err);
                                        //this.toast.setMessage('Error en el envio de el Correo','success');
                                      }
                                    );
                                },
                                (err) => {
                                  console.log(
                                    "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                                      err
                                  );
                                }
                              );
                          },
                          (error) => {
                            this.isEnviadoSolPed = false;
                            console.log(error);
                            this.toast.setMessage(error.message, "danger");
                          }
                        );
                    }
                  },
                  (err) => {
                    console.log(
                      "error al recuperar la informacion de las Exxcepcions" +
                        err
                    );
                  }
                );
              // this.DataInsert.TipoSolicitud = 2;
              // this.solicitudComp.InsertSolicitudPedido1(this.DataInsert).subscribe(
              //   res => {
              //     console.log("??????????????????????????????????????");
              //     console.log(res);
              //     console.log("??????????????????????????????????????");
              //     console.log(this.DataInsert.Area.IdDireccion);
              //     this.IdSoliforFile = res;

              //     var Role;
              //     var status;

              //     this.solicitudComp.checkdirauthexeption(this.DataInsert.Area.IdDireccion).subscribe(data =>{
              //       //se envia parametro de IdSOlicitud para identificar correctamente la cotizacion
              //       this.uploader.options.headers=[];
              //       this.uploader.options.headers.push({name:'IdSol', value:this.IdSoliforFile.toString()});
              //       this.uploader.setOptions(this.uploader);
              //       this.uploader.uploadAll();
              //       console.log(data[0]);
              //       console.log("¡¡¡?¡?¡?¡?¡?¡?¡?¡?¡?¡?¡?¡?¡?¡?¡?¡?");
              //       console.log(this.DataInsert.Area)
              //       if(data[0] != undefined || data[0] != null){
              //         Role = data[0].IdRole + 1;
              //         status = data[0].IdRole;
              //         console.log(Role);
              //         console.log(status);
              //         console.log(this.DataInsert.Area.IdDireccion);
              //         var Solicitante = this.DataInsert.Usr;
              //         var IdDIreccion = this.DataInsert.Area.IdDireccion;
              //         var NombreDir = this.DataInsert.Area.Nombre;
              //             this.solicitudComp.getUserAutorizador(this.DataInsert.Area.IdDireccion,Role).subscribe(data =>{
              //               this.UsrAuthEmail = data;
              //               console.log("------------------------------");
              //               console.log(this.UsrAuthEmail[0]);
              //               console.log("------------------0------------");
              //               console.log("Id de la DIreccion a enviar correo"+IdDIreccion);
              //               console.log("Nombre de la DIrecion a la que se enviara mail--->" + NombreDir);
              //               this.toast.setMessage('Envio de Solicitud Correcto. ', 'success');
              //               //si se guardo la Solicitud limpiamos los registros
              //               this.isEnviadoSolPed = false;
              //               this.date = '';
              //               this.usr.reset();
              //               this.puesto.reset();
              //               this.email.reset();
              //               this.tel.reset();
              //               this.ext.reset();
              //               this.nombreProduccion.reset();
              //               this.ngOnInit();
              //               this.addProdForm.reset();
              //               this.BloqMoreItem = false;
              //               //esta parte es para el envio de correo para el dir de area.
              //               this.solicitudComp.SendEmailNewSolicitud(res, status, IdDIreccion,  NombreDir, Solicitante, this.UsrAuthEmail[0].IdRole, this.UsrAuthEmail[0].NombreCompleto, this.UsrAuthEmail[0].Email )
              //               .subscribe( res =>{
              //                 console.log(res);
              //                 this.toast.setMessage('Se realizo el envio del Email a Dir de Area','success');

              //               }, err=>{
              //                 console.log(err);
              //                 //this.toast.setMessage('Error en el envio de el Correo','success');
              //               })
              //             },
              //             err=>{
              //               console.log("error al recuperar la informacion del usuario aotorizador por DIreccion" + err);
              //             });
              //       }else{

              //         Role = 2;
              //         status = 1;
              //         console.log(Role);
              //         console.log(status);
              //         console.log(this.DataInsert.Area.IdDireccion);
              //         var Solicitante = this.DataInsert.Usr;
              //         var IdDIreccion = this.DataInsert.Area.IdDireccion;
              //         var NombreDir = this.DataInsert.Area.Nombre;
              //             this.solicitudComp.getUserAutorizador(this.DataInsert.Area.IdDireccion,Role).subscribe(data =>{
              //               this.UsrAuthEmail = data;
              //               console.log("------------------------------");
              //               console.log(this.UsrAuthEmail[0]);
              //               console.log("------------------0------------");
              //               console.log("Id de la DIreccion a enviar correo"+IdDIreccion);
              //               console.log("Nombre de la DIrecion a la que se enviara mail--->" + NombreDir);
              //               this.toast.setMessage('Envio de Solicitud Correcto. ', 'success');
              //               //si no se ha enviado a guardar la SolPed a la base de datos el boton de subir cotizacion quedara inhablilitado
              //               this.isEnviadoSolPed = false;
              //               this.ngOnInit();
              //               //si se guardo la Solicitud limpiamos los registros
              //               this.date = '';
              //               this.usr.reset();
              //               this.puesto.reset();
              //               this.email.reset();
              //               this.tel.reset();
              //               this.ext.reset();
              //               this.nombreProduccion.reset();
              //               this.ngOnInit();
              //               this.addProdForm.reset();
              //               this.BloqMoreItem = false;
              //               //esta parte es para el envio de correo para el dir de area.
              //               this.solicitudComp.SendEmailNewSolicitud(res, status, IdDIreccion,  NombreDir, Solicitante, this.UsrAuthEmail[0].IdRole, this.UsrAuthEmail[0].NombreCompleto, this.UsrAuthEmail[0].Email )
              //               .subscribe( res =>{
              //                 console.log(res);
              //                 this.toast.setMessage('Se realizo el envio del Email a Dir de Area','success');

              //               }, err=>{
              //                 console.log(err);
              //                 //this.toast.setMessage('Error en el envio de el Correo','success');
              //               })
              //             },
              //             err=>{
              //               console.log("error al recuperar la informacion del usuario aotorizador por DIreccion" + err);
              //             });
              //       }
              //     }, err=>{
              //       console.log("error al recuperar la informacion de las Exxcepcions" + err );
              //     });
              //   },
              //   error => {
              //     this.isEnviadoSolPed = false;
              //     console.log(error)
              //     this.toast.setMessage('Ocurrio un Problema al Guardar tu Solicitud. Intenta de nuevo por favor ', 'danger');
              //   }
              // );
            } else {
              //this.toast.setMessage('Existe un problema, favor de Validar Informacion ', 'danger');
            }
          }

          if (this.DataInsert.Imputacion.IdTipoSolicitud == 3) {
            console.log(
              "se cumple la condicion-------------3------------------" +
                this.DataInsert.CentroCostos +
                "-------------" +
                this.DataInsert.OrdenInterna +
                "--------------" +
                this.DataInsert.Cuentamayor +
                "------------" +
                this.SelectedCostos +
                "------------" +
                this.SelectedOInvercion +
                "-------------" +
                this.SelectedCMayor
            );
            if (
              this.SelectedCostos != undefined ||
              (this.SelectedCostos != null &&
                this.SelectedOInvercion == undefined) ||
              (this.SelectedOInvercion != null &&
                this.SelectedCMayor != undefined) ||
              this.SelectedCMayor != null
              //&& valor.Material == undefined
              //&& valor.Almacen == undefined
              //&& this.Centro != undefined
              //&& valor.NumActivo == undefined
            ) {
              this.DataInsert.CentroCostos = this.SelectedCostos;
              this.DataInsert.OrdenInterna = this.SelectedOInvercion;
              this.DataInsert.Cuentamayor = this.SelectedCMayor;

              this.DataInsert.Fecha = this.date;
              this.DataInsert.Usr = this.usr.value;
              this.DataInsert.Puesto = this.puesto.value;
              this.DataInsert.Email = this.email.value;
              this.DataInsert.Tel = this.tel.value;
              this.DataInsert.Ext = this.ext.value;
              this.DataInsert.IdUsuario = this.auth.currentUser.IdUsuario;
              this.DataInsert.NombreProduccion = this.nombreProduccion.value;

              console.log(
                "este es un tipo de Solicitud de TIPO --IMP K-- CARGO A CENTRO DE COSTO /*debe de cambiar el grupo de articulo a 170101**/"
              );
              var Role;
              var status;
              this.solicitudComp
                .checkdirauthexeption(this.DataInsert.Area.IdDireccion)
                .subscribe(
                  (data) => {
                    if (data[0] != undefined || data[0] != null) {
                      console.log(
                        "validamos que tipo de esxcepcion se esta manejando"
                      );
                      if (data[0].IdRole == 2) {
                        Role = data[0].IdRole + 1;
                        status = data[0].IdRole;
                        this.DataInsert.TipoSolicitud = 3;
                        this.DataInsert.EstatusSol = status; //se igual el satus al role por que es igual al de Autorizada por Gerente para que lo visualice Director
                        this.solicitudComp
                          .InsertSolicitudPedido1(this.DataInsert)
                          .subscribe(
                            (res) => {
                              console.log(
                                "??????????????????????????????????????"
                              );
                              console.log(res);
                              console.log(
                                "??????????????????????????????????????"
                              );
                              console.log(this.DataInsert.Area.IdDireccion);
                              this.IdSoliforFile = res;
                              //se envia parametro de IdSOlicitud para identificar correctamente la cotizacion
                              this.uploader.options.headers = [];
                              this.uploader.options.headers.push({
                                name: "IdSol",
                                value: this.IdSoliforFile.toString(),
                              });
                              this.uploader.setOptions(this.uploader);
                              this.uploader.uploadAll();
                              var Solicitante = this.DataInsert.Usr;
                              var IdDIreccion = this.DataInsert.Area
                                .IdDireccion;
                              var NombreDir = this.DataInsert.Area.Nombre;
                              this.solicitudComp
                                .getUserAutorizador(
                                  this.DataInsert.Area.IdDireccion,
                                  Role
                                )
                                .subscribe(
                                  (data) => {
                                    this.UsrAuthEmail = data;
                                    console.log(
                                      "------------------------------"
                                    );
                                    console.log(this.UsrAuthEmail[0]);
                                    console.log(
                                      "------------------0------------"
                                    );
                                    console.log(
                                      "Id de la DIreccion a enviar correo" +
                                        IdDIreccion
                                    );
                                    console.log(
                                      "Nombre de la DIrecion a la que se enviara mail--->" +
                                        NombreDir
                                    );
                                    this.toast.setMessage(
                                      "Envio de Solicitud Correcto. ",
                                      "success"
                                    );
                                    //si se guardo la Solicitud limpiamos los registros
                                    this.isEnviadoSolPed = false;
                                    this.date = "";
                                    this.usr.reset();
                                    this.puesto.reset();
                                    this.email.reset();
                                    this.tel.reset();
                                    this.ext.reset();
                                    this.nombreProduccion.reset();
                                    this.ngOnInit();
                                    this.addProdForm.reset();
                                    this.BloqMoreItem = false;
                                    var SendStatusMailAutorizacion = 4; //este numero cuatro se ponodra en el boton de autorizar para saber que autoriza direccion a nivel mail.
                                    var SendStatusmailRechazo = 5; //este numero se pondra en el boton de rechaar para saber que el directore rechaza la nueva solicitud desde el mail.
                                    //esta parte es para el envio de correo para el dir de area.
                                    this.solicitudComp
                                      .SendEmailNewSolicitud(
                                        res,
                                        status,
                                        IdDIreccion,
                                        NombreDir,
                                        Solicitante,
                                        this.UsrAuthEmail[0].IdRole,
                                        this.UsrAuthEmail[0].NombreCompleto,
                                        this.UsrAuthEmail[0].Email,
                                        SendStatusMailAutorizacion,
                                        SendStatusmailRechazo
                                      )
                                      .subscribe(
                                        (res) => {
                                          console.log(res);
                                          this.toast.setMessage(
                                            "Se realizo el envio del Email a Dir de Area",
                                            "success"
                                          );
                                        },
                                        (error) => {
                                          if(error.status == 403 || error.status == 404){
                                            this.toast.setMessage(
                                              error.message,
                                              "danger"
                                            );
                                            this.auth.logout();
                                          }
                                          console.log(error);
                                          //this.toast.setMessage('Error en el envio de el Correo','success');
                                        }
                                      );
                                  },
                                  (error) => {
                                    if(error.status == 403 || error.status == 404){
                                      this.toast.setMessage(
                                        error.message,
                                        "danger"
                                      );
                                      this.auth.logout();
                                    }
                                    console.log(
                                      "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                                        error
                                    );
                                  }
                                );
                            },
                            (error) => {
                              this.isEnviadoSolPed = false;
                              if(error.status == 403 || error.status == 404){
                                this.toast.setMessage(
                                  error.message,
                                  "danger"
                                );
                                this.auth.logout();
                              }
                              this.toast.setMessage(error.message, "danger");
                            }
                          );
                      } else if (data[0].IdRole == 3) {
                        Role = data[0].IdRole - 1;
                        status = data[0].IdRole - 2;
                        this.DataInsert.TipoSolicitud = 3;
                        this.DataInsert.EstatusSol = status;
                        this.solicitudComp
                          .InsertSolicitudPedido1(this.DataInsert)
                          .subscribe(
                            (res) => {
                              console.log(
                                "??????????????????????????????????????"
                              );
                              console.log(res);
                              console.log(
                                "??????????????????????????????????????"
                              );
                              console.log(this.DataInsert.Area.IdDireccion);
                              this.IdSoliforFile = res;
                              //se envia parametro de IdSOlicitud para identificar correctamente la cotizacion
                              this.uploader.options.headers = [];
                              this.uploader.options.headers.push({
                                name: "IdSol",
                                value: this.IdSoliforFile.toString(),
                              });
                              this.uploader.setOptions(this.uploader);
                              this.uploader.uploadAll();
                              var Solicitante = this.DataInsert.Usr;
                              var IdDIreccion = this.DataInsert.Area
                                .IdDireccion;
                              var NombreDir = this.DataInsert.Area.Nombre;
                              this.solicitudComp
                                .getUserAutorizador(
                                  this.DataInsert.Area.IdDireccion,
                                  Role
                                )
                                .subscribe(
                                  (data) => {
                                    this.UsrAuthEmail = data;
                                    console.log(
                                      "------------------------------"
                                    );
                                    console.log(this.UsrAuthEmail[0]);
                                    console.log(
                                      "------------------0------------"
                                    );
                                    console.log(
                                      "Id de la DIreccion a enviar correo" +
                                        IdDIreccion
                                    );
                                    console.log(
                                      "Nombre de la DIrecion a la que se enviara mail--->" +
                                        NombreDir
                                    );
                                    this.toast.setMessage(
                                      "Envio de Solicitud Correcto. ",
                                      "success"
                                    );
                                    //si se guardo la Solicitud limpiamos los registros
                                    this.isEnviadoSolPed = false;
                                    this.date = "";
                                    this.usr.reset();
                                    this.puesto.reset();
                                    this.email.reset();
                                    this.tel.reset();
                                    this.ext.reset();
                                    this.nombreProduccion.reset();
                                    this.ngOnInit();
                                    this.addProdForm.reset();
                                    this.BloqMoreItem = false;
                                    var SendStatusMailAutorizacion = 0; //este numero cuatro se ponodra en el boton de autorizar para saber que autoriza direccion a nivel mail.
                                    var SendStatusmailRechazo = 0; //este numero se pondra en el boton de rechaar para saber que el directore rechaza la nueva solicitud desde el mail.
                                    //esta parte es para el envio de correo para el dir de area.
                                    this.solicitudComp
                                      .SendEmailNewSolicitud(
                                        res,
                                        status,
                                        IdDIreccion,
                                        NombreDir,
                                        Solicitante,
                                        this.UsrAuthEmail[0].IdRole,
                                        this.UsrAuthEmail[0].NombreCompleto,
                                        this.UsrAuthEmail[0].Email,
                                        SendStatusMailAutorizacion,
                                        SendStatusmailRechazo
                                      )
                                      .subscribe(
                                        (res) => {
                                          console.log(res);
                                          this.toast.setMessage(
                                            "Se realizo el envio del Email a Dir de Area",
                                            "success"
                                          );
                                        },
                                        (error) => {
                                          if(error.status == 403 || error.status == 404){
                                            this.toast.setMessage(
                                              error.message,
                                              "danger"
                                            );
                                            this.auth.logout();
                                          }
                                          console.log(error);
                                          //this.toast.setMessage('Error en el envio de el Correo','success');
                                        }
                                      );
                                  },
                                  (error) => {
                                    if(error.status == 403 || error.status == 404){
                                      this.toast.setMessage(
                                        error.message,
                                        "danger"
                                      );
                                      this.auth.logout();
                                    }
                                    console.log(
                                      "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                                        error
                                    );
                                  }
                                );
                            },
                            (error) => {
                              this.isEnviadoSolPed = false;
                              if(error.status == 403 || error.status == 404){
                                this.toast.setMessage(
                                  error.message,
                                  "danger"
                                );
                                this.auth.logout();
                              }
                              this.toast.setMessage(error.message, "danger");
                            }
                          );
                      }
                    } else {
                      console.log(
                        "se sigue con el flujo normal de las autorizaciones"
                      );
                      Role = 2;
                      status = 1;
                      this.DataInsert.TipoSolicitud = 3;
                      this.DataInsert.EstatusSol = status;
                      this.solicitudComp
                        .InsertSolicitudPedido1(this.DataInsert)
                        .subscribe(
                          (res) => {
                            console.log(
                              "??????????????????????????????????????"
                            );
                            console.log(res);
                            console.log(
                              "??????????????????????????????????????"
                            );
                            console.log(this.DataInsert.Area.IdDireccion);
                            this.IdSoliforFile = res;
                            this.uploader.options.headers = [];
                            this.uploader.options.headers.push({
                              name: "IdSol",
                              value: this.IdSoliforFile.toString(),
                            });
                            this.uploader.setOptions(this.uploader);
                            this.uploader.uploadAll();
                            var Solicitante = this.DataInsert.Usr;
                            var IdDIreccion = this.DataInsert.Area.IdDireccion;
                            var NombreDir = this.DataInsert.Area.Nombre;
                            this.solicitudComp
                              .getUserAutorizador(
                                this.DataInsert.Area.IdDireccion,
                                Role
                              )
                              .subscribe(
                                (data) => {
                                  this.UsrAuthEmail = data;
                                  console.log("------------------------------");
                                  console.log(this.UsrAuthEmail[0]);
                                  console.log(
                                    "------------------0------------"
                                  );
                                  console.log(
                                    "Id de la DIreccion a enviar correo" +
                                      IdDIreccion
                                  );
                                  console.log(
                                    "Nombre de la DIrecion a la que se enviara mail--->" +
                                      NombreDir
                                  );
                                  this.toast.setMessage(
                                    "Envio de Solicitud Correcto. ",
                                    "success"
                                  );
                                  //si se guardo la Solicitud limpiamos los registros
                                  this.isEnviadoSolPed = false;
                                  this.date = "";
                                  this.usr.reset();
                                  this.puesto.reset();
                                  this.email.reset();
                                  this.tel.reset();
                                  this.ext.reset();
                                  this.nombreProduccion.reset();
                                  this.ngOnInit();
                                  this.addProdForm.reset();
                                  this.BloqMoreItem = false;
                                  var SendStatusMailAutorizacion = 0; //este numero cuatro se ponodra en el boton de autorizar para saber que autoriza direccion a nivel mail.
                                  var SendStatusmailRechazo = 0; //este numero se pondra en el boton de rechaar para saber que el directore rechaza la nueva solicitud desde el mail.
                                  //esta parte es para el envio de correo para el dir de area.
                                  this.solicitudComp
                                    .SendEmailNewSolicitud(
                                      res,
                                      status,
                                      IdDIreccion,
                                      NombreDir,
                                      Solicitante,
                                      this.UsrAuthEmail[0].IdRole,
                                      this.UsrAuthEmail[0].NombreCompleto,
                                      this.UsrAuthEmail[0].Email,
                                      SendStatusMailAutorizacion,
                                      SendStatusmailRechazo
                                    )
                                    .subscribe(
                                      (res) => {
                                        console.log(res);
                                        this.toast.setMessage(
                                          "Se realizo el envio del Email a Dir de Area",
                                          "success"
                                        );
                                      },
                                      (error) => {
                                        if(error.status == 403 || error.status == 404){
                                          this.toast.setMessage(
                                            error.message,
                                            "danger"
                                          );
                                          this.auth.logout();
                                        }
                                        console.log(error);
                                        //this.toast.setMessage('Error en el envio de el Correo','success');
                                      }
                                    );
                                },
                                (error) => {
                                  if(error.status == 403 || error.status == 404){
                                    this.toast.setMessage(
                                      error.message,
                                      "danger"
                                    );
                                    this.auth.logout();
                                  }
                                  console.log(
                                    "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                                      error
                                  );
                                }
                              );
                          },
                          (error) => {
                            this.isEnviadoSolPed = false;
                            if(error.status == 403 || error.status == 404){
                              this.toast.setMessage(
                                error.message,
                                "danger"
                              );
                              this.auth.logout();
                            }
                            this.toast.setMessage(error.message, "danger");
                          }
                        );
                    }
                  },
                  (error) => {
                    if(error.status == 403 || error.status == 404){
                      this.toast.setMessage(
                        error.message,
                        "danger"
                      );
                      this.auth.logout();
                    }
                    console.log(
                      "error al recuperar la informacion de las Exxcepcions" +
                        error
                    );
                  }
                );
            } else {
              this.toast.setMessage(
                "Existe un problema, favor de Validar Informacion ",
                "danger"
              );
            }
          }

          if (this.DataInsert.Imputacion.IdTipoSolicitud == 4) {
            console.log(
              "se cumple la condicion-------------4------------------"
            );

            console.log("CCostos   " + "   CMayor   " + "  OEstadisitica   ");
            console.log(this.SelectedCostosChild);
            console.log(this.SelectedCMayorChild);
            console.log(this.SelectedOrEstChild);
            console.log("OR   " + this.SelectedOrdenEstaHijo);
            console.log("CM   " + this.SelectedCMayorHijo);
            console.log("CC   " + this.SelectCentroCostosHijo);

            // var BreakException = {};
            var datachild;
              this.DataInsert.Productos.forEach((element) => {
                console.log(element.ChildsProducts.length);
                if(element.ChildsProducts.length === 0 || element.ChildsProducts.length === undefined ||element.ChildsProducts.length === null){
                  datachild = 0;
                }
              });
             
            

            if (
              this.SelectedCostos == undefined &&
              this.SelectCentroCostosHijo != undefined &&
              this.SelectedOInvercion == undefined &&
              this.SelectedOrdenEstaHijo == undefined &&
              this.SelectedCMayor == undefined &&
              this.SelectedCMayorHijo != undefined &&
              datachild != 0
            ) {
              console.log("Valiiidoooooooooooooooooooooooooooooooooooooo");
              this.DataInsert.Fecha = this.date;
              this.DataInsert.Usr = this.usr.value;
              this.DataInsert.Puesto = this.puesto.value;
              this.DataInsert.Email = this.email.value;
              this.DataInsert.Tel = this.tel.value;
              this.DataInsert.Ext = this.ext.value;
              this.DataInsert.IdUsuario = this.auth.currentUser.IdUsuario;
              this.DataInsert.NombreProduccion = this.nombreProduccion.value;

              console.log(
                "este es un tipo de Solicitud de TIPO --IMP K-- KF Servicios /*cambia grupo articulo 160101*/"
              );
              var Role;
              var status;
              this.solicitudComp
                .checkdirauthexeption(this.DataInsert.Area.IdDireccion)
                .subscribe(
                  (data) => {
                    if (data[0] != undefined || data[0] != null) {
                      console.log(
                        "validamos que tipo de esxcepcion se esta manejando"
                      );
                      if (data[0].IdRole == 2) {
                        console.log("Se excluye de la autorizacion a GERENTE");
                        Role = data[0].IdRole + 1;
                        status = data[0].IdRole;
                        this.DataInsert.TipoSolicitud = 4;
                        this.DataInsert.EstatusSol = status;
                        this.solicitudComp
                          .InsertSolicitudPedido1(this.DataInsert)
                          .subscribe(
                            (res) => {
                              console.log(
                                "??????????????????????????????????????"
                              );
                              console.log(res);
                              console.log(
                                "??????????????????????????????????????"
                              );
                              console.log(this.DataInsert.Area.IdDireccion);
                              this.IdSoliforFile = res;
                              //se envia parametro de IdSOlicitud para identificar correctamente la cotizacion
                              this.uploader.options.headers = [];
                              this.uploader.options.headers.push({
                                name: "IdSol",
                                value: this.IdSoliforFile.toString(),
                              });
                              this.uploader.setOptions(this.uploader);
                              this.uploader.uploadAll();
                              console.log(Role);
                              console.log(status);
                              console.log(this.DataInsert.Area.IdDireccion);
                              var Solicitante = this.DataInsert.Usr;
                              var IdDIreccion = this.DataInsert.Area
                                .IdDireccion;
                              var NombreDir = this.DataInsert.Area.Nombre;
                              this.solicitudComp
                                .getUserAutorizador(
                                  this.DataInsert.Area.IdDireccion,
                                  Role
                                )
                                .subscribe(
                                  (data) => {
                                    this.UsrAuthEmail = data;
                                    console.log(
                                      "------------------------------"
                                    );
                                    console.log(this.UsrAuthEmail[0]);
                                    console.log(
                                      "------------------0------------"
                                    );
                                    console.log(
                                      "Id de la DIreccion a enviar correo" +
                                        IdDIreccion
                                    );
                                    console.log(
                                      "Nombre de la DIrecion a la que se enviara mail--->" +
                                        NombreDir
                                    );
                                    this.toast.setMessage(
                                      "Envio de Solicitud Correcto. ",
                                      "success"
                                    );
                                    //si se guardo la Solicitud limpiamos los registros
                                    this.isEnviadoSolPed = false;
                                    this.date = "";
                                    this.usr.reset();
                                    this.puesto.reset();
                                    this.email.reset();
                                    this.tel.reset();
                                    this.ext.reset();
                                    this.nombreProduccion.reset();
                                    this.ngOnInit();
                                    this.addProdForm.reset();
                                    this.BloqMoreItem = false;
                                    var SendStatusMailAutorizacion = 4; //este numero cuatro se ponodra en el boton de autorizar para saber que autoriza direccion a nivel mail.
                                    var SendStatusmailRechazo = 5; //este numero se pondra en el boton de rechaar para saber que el directore rechaza la nueva solicitud desde el mail.
                                    //esta parte es para el envio de correo para el dir de area.
                                    this.solicitudComp
                                      .SendEmailNewSolicitud(
                                        res,
                                        status,
                                        IdDIreccion,
                                        NombreDir,
                                        Solicitante,
                                        this.UsrAuthEmail[0].IdRole,
                                        this.UsrAuthEmail[0].NombreCompleto,
                                        this.UsrAuthEmail[0].Email,
                                        SendStatusMailAutorizacion,
                                        SendStatusmailRechazo
                                      )
                                      .subscribe(
                                        (res) => {
                                          console.log(res);
                                          this.toast.setMessage(
                                            "Se realizo el envio del Email a Dir de Area",
                                            "success"
                                          );
                                        },
                                        (error) => {
                                          if(error.status == 403 || error.status == 404){
                                            this.toast.setMessage(
                                              error.message,
                                              "danger"
                                            );
                                            this.auth.logout();
                                          }
                                          console.log(error);
                                          //this.toast.setMessage('Error en el envio de el Correo','success');
                                        }
                                      );
                                  },
                                  (error) => {
                                    if(error.status == 403 || error.status == 404){
                                      this.toast.setMessage(
                                        error.message,
                                        "danger"
                                      );
                                      this.auth.logout();
                                    }
                                    console.log(
                                      "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                                        error
                                    );
                                  }
                                );
                            },
                            (error) => {
                              this.isEnviadoSolPed = false;
                              if(error.status == 403 || error.status == 404){
                                this.toast.setMessage(
                                  error.message,
                                  "danger"
                                );
                                this.auth.logout();
                              }
                              this.toast.setMessage(error.message, "danger");
                            }
                          );
                      } else if (data[0].IdRole == 3) {
                        console.log(
                          "Se excluye dde la autorizaciones a DIRECTOR o SUBDIRECTOR"
                        );
                        Role = data[0].IdRole - 1;
                        status = data[0].IdRole - 2;
                        this.DataInsert.TipoSolicitud = 4;
                        this.DataInsert.EstatusSol = status;
                        this.solicitudComp
                          .InsertSolicitudPedido1(this.DataInsert)
                          .subscribe(
                            (res) => {
                              console.log(
                                "??????????????????????????????????????"
                              );
                              console.log(res);
                              console.log(
                                "??????????????????????????????????????"
                              );
                              console.log(this.DataInsert.Area.IdDireccion);
                              this.IdSoliforFile = res;
                              //se envia parametro de IdSOlicitud para identificar correctamente la cotizacion
                              this.uploader.options.headers = [];
                              this.uploader.options.headers.push({
                                name: "IdSol",
                                value: this.IdSoliforFile.toString(),
                              });
                              this.uploader.setOptions(this.uploader);
                              this.uploader.uploadAll();
                              console.log(Role);
                              console.log(status);
                              console.log(this.DataInsert.Area.IdDireccion);
                              var Solicitante = this.DataInsert.Usr;
                              var IdDIreccion = this.DataInsert.Area
                                .IdDireccion;
                              var NombreDir = this.DataInsert.Area.Nombre;
                              this.solicitudComp
                                .getUserAutorizador(
                                  this.DataInsert.Area.IdDireccion,
                                  Role
                                )
                                .subscribe(
                                  (data) => {
                                    this.UsrAuthEmail = data;
                                    console.log(
                                      "------------------------------"
                                    );
                                    console.log(this.UsrAuthEmail[0]);
                                    console.log(
                                      "------------------0------------"
                                    );
                                    console.log(
                                      "Id de la DIreccion a enviar correo" +
                                        IdDIreccion
                                    );
                                    console.log(
                                      "Nombre de la DIrecion a la que se enviara mail--->" +
                                        NombreDir
                                    );
                                    this.toast.setMessage(
                                      "Envio de Solicitud Correcto. ",
                                      "success"
                                    );
                                    //si se guardo la Solicitud limpiamos los registros
                                    this.isEnviadoSolPed = false;
                                    this.date = "";
                                    this.usr.reset();
                                    this.puesto.reset();
                                    this.email.reset();
                                    this.tel.reset();
                                    this.ext.reset();
                                    this.nombreProduccion.reset();
                                    this.ngOnInit();
                                    this.addProdForm.reset();
                                    this.BloqMoreItem = false;
                                    var SendStatusMailAutorizacion = 0; //este numero cuatro se ponodra en el boton de autorizar para saber que autoriza direccion a nivel mail.
                                    var SendStatusmailRechazo = 0; //este numero se pondra en el boton de rechaar para saber que el directore rechaza la nueva solicitud desde el mail.
                                    //esta parte es para el envio de correo para el dir de area.
                                    this.solicitudComp
                                      .SendEmailNewSolicitud(
                                        res,
                                        status,
                                        IdDIreccion,
                                        NombreDir,
                                        Solicitante,
                                        this.UsrAuthEmail[0].IdRole,
                                        this.UsrAuthEmail[0].NombreCompleto,
                                        this.UsrAuthEmail[0].Email,
                                        SendStatusMailAutorizacion,
                                        SendStatusmailRechazo
                                      )
                                      .subscribe(
                                        (res) => {
                                          console.log(res);
                                          this.toast.setMessage(
                                            "Se realizo el envio del Email a Dir de Area",
                                            "success"
                                          );
                                        },
                                        (error) => {
                                          if(error.status == 403 || error.status == 404){
                                            this.toast.setMessage(
                                              error.message,
                                              "danger"
                                            );
                                            this.auth.logout();
                                          }
                                          console.log(error);
                                          //this.toast.setMessage('Error en el envio de el Correo','success');
                                        }
                                      );
                                  },
                                  (error) => {
                                    if(error.status == 403 || error.status == 404){
                                      this.toast.setMessage(
                                        error.message,
                                        "danger"
                                      );
                                      this.auth.logout();
                                    }
                                    console.log(
                                      "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                                        error
                                    );
                                  }
                                );
                            },
                            (error) => {
                              this.isEnviadoSolPed = false;
                              if(error.status == 403 || error.status == 404){
                                this.toast.setMessage(
                                  error.message,
                                  "danger"
                                );
                                this.auth.logout();
                              }
                              this.toast.setMessage(error.message, "danger");
                            }
                          );
                      }
                    } else {
                      console.log(
                        "seguimos el flujo normal de las autorizaciones"
                      );
                      Role = 2;
                      status = 1;
                      this.DataInsert.TipoSolicitud = 4;
                      this.DataInsert.EstatusSol = status;
                      this.solicitudComp
                        .InsertSolicitudPedido1(this.DataInsert)
                        .subscribe(
                          (res) => {
                            console.log(
                              "??????????????????????????????????????"
                            );
                            console.log(res);
                            console.log(
                              "??????????????????????????????????????"
                            );
                            console.log(this.DataInsert.Area.IdDireccion);
                            this.IdSoliforFile = res;
                            //se envia parametro de IdSOlicitud para identificar correctamente la cotizacion
                            this.uploader.options.headers = [];
                            this.uploader.options.headers.push({
                              name: "IdSol",
                              value: this.IdSoliforFile.toString(),
                            });
                            this.uploader.setOptions(this.uploader);
                            this.uploader.uploadAll();
                            console.log(Role);
                            console.log(status);
                            console.log(this.DataInsert.Area.IdDireccion);
                            var Solicitante = this.DataInsert.Usr;
                            var IdDIreccion = this.DataInsert.Area.IdDireccion;
                            var NombreDir = this.DataInsert.Area.Nombre;
                            this.solicitudComp
                              .getUserAutorizador(
                                this.DataInsert.Area.IdDireccion,
                                Role
                              )
                              .subscribe(
                                (data) => {
                                  this.UsrAuthEmail = data;
                                  console.log("------------------------------");
                                  console.log(this.UsrAuthEmail[0]);
                                  console.log(
                                    "------------------0------------"
                                  );
                                  console.log(
                                    "Id de la DIreccion a enviar correo" +
                                      IdDIreccion
                                  );
                                  console.log(
                                    "Nombre de la DIrecion a la que se enviara mail--->" +
                                      NombreDir
                                  );
                                  this.toast.setMessage(
                                    "Envio de Solicitud Correcto. ",
                                    "success"
                                  );
                                  //si se guardo la Solicitud limpiamos los registros
                                  this.isEnviadoSolPed = false;
                                  this.date = "";
                                  this.usr.reset();
                                  this.puesto.reset();
                                  this.email.reset();
                                  this.tel.reset();
                                  this.ext.reset();
                                  this.nombreProduccion.reset();
                                  this.ngOnInit();
                                  this.addProdForm.reset();
                                  this.BloqMoreItem = false;
                                  var SendStatusMailAutorizacion = 0; //este numero cuatro se ponodra en el boton de autorizar para saber que autoriza direccion a nivel mail.
                                  var SendStatusmailRechazo = 0; //este numero se pondra en el boton de rechaar para saber que el directore rechaza la nueva solicitud desde el mail.
                                  //esta parte es para el envio de correo para el dir de area.
                                  this.solicitudComp
                                    .SendEmailNewSolicitud(
                                      res,
                                      status,
                                      IdDIreccion,
                                      NombreDir,
                                      Solicitante,
                                      this.UsrAuthEmail[0].IdRole,
                                      this.UsrAuthEmail[0].NombreCompleto,
                                      this.UsrAuthEmail[0].Email,
                                      SendStatusMailAutorizacion,
                                      SendStatusmailRechazo
                                    )
                                    .subscribe(
                                      (res) => {
                                        console.log(res);
                                        this.toast.setMessage(
                                          "Se realizo el envio del Email a Dir de Area",
                                          "success"
                                        );
                                      },
                                      (error) => {
                                        if(error.status == 403 || error.status == 404){
                                          this.toast.setMessage(
                                            error.message,
                                            "danger"
                                          );
                                          this.auth.logout();
                                        }
                                        console.log(error);
                                        //this.toast.setMessage('Error en el envio de el Correo','success');
                                      }
                                    );
                                },
                                (error) => {
                                  if(error.status == 403 || error.status == 404){
                                    this.toast.setMessage(
                                      error.message,
                                      "danger"
                                    );
                                    this.auth.logout();
                                  }
                                  console.log(
                                    "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                                      error
                                  );
                                }
                              );
                          },
                          (error) => {
                            this.isEnviadoSolPed = false;
                            if(error.status == 403 || error.status == 404){
                              this.toast.setMessage(
                                error.message,
                                "danger"
                              );
                              this.auth.logout();
                            }
                            this.toast.setMessage(error.message, "danger");
                          }
                        );
                    }
                  },
                  (error) => {
                    if(error.status == 403 || error.status == 404){
                      this.toast.setMessage(
                        error.message,
                        "danger"
                      );
                      this.auth.logout();
                    }
                    console.log(
                      "error al recuperar la informacion de las Exxcepcions" +
                        error
                    );
                  }
                );
            } else {
              this.toast.setMessage(
                "Una Solicitud de Tipo Servicio debe contener un Sub Producto, favor de validar informacion",
                "danger"
              );
            }
          }

          if (this.DataInsert.Imputacion.IdTipoSolicitud == 5) {
            if (
              this.SelectedCostos == undefined &&
              this.SelectedOInvercion == undefined &&
              this.SelectedCMayor == undefined
              //&& valor.Material != undefined
              //&& valor.Almacen != undefined
              //&& this.Centro != undefined
              //&& valor.NumActivo == undefined
            ) {
              this.DataInsert.CentroCostos = this.SelectedCostos;
              this.DataInsert.OrdenInterna = this.SelectedOInvercion;
              this.DataInsert.Cuentamayor = this.SelectedCMayor;

              this.DataInsert.Fecha = this.date;
              this.DataInsert.Usr = this.usr.value;
              this.DataInsert.Puesto = this.puesto.value;
              this.DataInsert.Email = this.email.value;
              this.DataInsert.Tel = this.tel.value;
              this.DataInsert.Ext = this.ext.value;
              this.DataInsert.IdUsuario = this.auth.currentUser.IdUsuario;
              this.DataInsert.NombreProduccion = this.nombreProduccion.value;

              console.log("Este es un tipo de solciitud --IMP Normal--");
              var Role;
              var status;
              this.solicitudComp
                .checkdirauthexeption(this.DataInsert.Area.IdDireccion)
                .subscribe(
                  (data) => {
                    if (data[0] != undefined || data[0] != null) {
                      console.log(
                        "validamos que tipo de esxcepcion se esta manejando"
                      );
                      if (data[0].IdRole == 2) {
                        console.log("Se excluye de la autorizacion a GERENTE");
                        Role = data[0].IdRole + 1;
                        status = data[0].IdRole;
                        this.DataInsert.TipoSolicitud = 5;
                        this.DataInsert.EstatusSol = status;
                        this.solicitudComp
                          .InsertSolicitudPedido1(this.DataInsert)
                          .subscribe(
                            (res) => {
                              // console.log("??????????????????????????????????????");
                              // console.log(res);
                              // console.log("??????????????????????????????????????");
                              console.log(this.DataInsert.Area.IdDireccion);
                              this.IdSoliforFile = res;
                              //se envia parametro de IdSOlicitud para identificar correctamente la cotizacion
                              this.uploader.options.headers = [];
                              this.uploader.options.headers.push({
                                name: "IdSol",
                                value: this.IdSoliforFile.toString(),
                              });
                              this.uploader.setOptions(this.uploader);
                              this.uploader.uploadAll();
                              console.log(Role);
                              console.log(status);
                              console.log(this.DataInsert.Area.IdDireccion);
                              var Solicitante = this.DataInsert.Usr;
                              var IdDIreccion = this.DataInsert.Area
                                .IdDireccion;
                              var NombreDir = this.DataInsert.Area.Nombre;
                              this.solicitudComp
                                .getUserAutorizador(
                                  this.DataInsert.Area.IdDireccion,
                                  Role
                                )
                                .subscribe(
                                  (data) => {
                                    this.UsrAuthEmail = data;
                                    console.log(
                                      "------------------------------"
                                    );
                                    console.log(this.UsrAuthEmail[0]);
                                    console.log(
                                      "------------------0------------"
                                    );
                                    console.log(
                                      "Id de la DIreccion a enviar correo" +
                                        IdDIreccion
                                    );
                                    console.log(
                                      "Nombre de la DIrecion a la que se enviara mail--->" +
                                        NombreDir
                                    );
                                    this.toast.setMessage(
                                      "Envio de Solicitud Correcto. ",
                                      "success"
                                    );
                                    //si se guardo la Solicitud limpiamos los registros
                                    this.isEnviadoSolPed = false;
                                    this.date = "";
                                    this.usr.reset();
                                    this.puesto.reset();
                                    this.email.reset();
                                    this.tel.reset();
                                    this.ext.reset();
                                    this.nombreProduccion.reset();
                                    this.ngOnInit();
                                    this.addProdForm.reset();
                                    this.BloqMoreItem = false;
                                    var SendStatusMailAutorizacion = 4; //este numero cuatro se ponodra en el boton de autorizar para saber que autoriza direccion a nivel mail.
                                    var SendStatusmailRechazo = 5; //este numero se pondra en el boton de rechaar para saber que el directore rechaza la nueva solicitud desde el mail.
                                    //esta parte es para el envio de correo para el dir de area.
                                    this.solicitudComp
                                      .SendEmailNewSolicitud(
                                        res,
                                        status,
                                        IdDIreccion,
                                        NombreDir,
                                        Solicitante,
                                        this.UsrAuthEmail[0].IdRole,
                                        this.UsrAuthEmail[0].NombreCompleto,
                                        this.UsrAuthEmail[0].Email,
                                        SendStatusMailAutorizacion,
                                        SendStatusmailRechazo
                                      )
                                      .subscribe(
                                        (res) => {
                                          console.log(res);
                                          this.toast.setMessage(
                                            "Se realizo el envio del Email a Dir de Area",
                                            "success"
                                          );
                                        },
                                        (error) => {
                                          if(error.status == 403 || error.status == 404){
                                            this.toast.setMessage(
                                              error.message,
                                              "danger"
                                            );
                                            this.auth.logout();
                                          }
                                          console.log(error);
                                          //this.toast.setMessage('Error en el envio de el Correo','success');
                                        }
                                      );
                                  },
                                  (error) => {
                                    if(error.status == 403 || error.status == 404){
                                      this.toast.setMessage(
                                        error.message,
                                        "danger"
                                      );
                                      this.auth.logout();
                                    }
                                    console.log(
                                      "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                                        error
                                    );
                                  }
                                );
                            },
                            (error) => {
                              this.isEnviadoSolPed = false;
                              if(error.status == 403 || error.status == 404){
                                this.toast.setMessage(
                                  error.message,
                                  "danger"
                                );
                                this.auth.logout();
                              }
                              this.toast.setMessage(error.message, "danger");
                            }
                          );
                      } else if (data[0].IdRole == 3) {
                        console.log(
                          "Se excluye dde la autorizaciones a DIRECTOR o SUBDIRECTOR"
                        );
                        Role = data[0].IdRole - 1;
                        status = data[0].IdRole - 2;
                        this.DataInsert.TipoSolicitud = 5;
                        this.DataInsert.EstatusSol = status;
                        this.solicitudComp
                          .InsertSolicitudPedido1(this.DataInsert)
                          .subscribe(
                            (res) => {
                              // console.log("??????????????????????????????????????");
                              // console.log(res);
                              // console.log("??????????????????????????????????????");
                              console.log(this.DataInsert.Area.IdDireccion);
                              this.IdSoliforFile = res;
                              //se envia parametro de IdSOlicitud para identificar correctamente la cotizacion
                              this.uploader.options.headers = [];
                              this.uploader.options.headers.push({
                                name: "IdSol",
                                value: this.IdSoliforFile.toString(),
                              });
                              this.uploader.setOptions(this.uploader);
                              this.uploader.uploadAll();
                              console.log(Role);
                              console.log(status);
                              console.log(this.DataInsert.Area.IdDireccion);
                              var Solicitante = this.DataInsert.Usr;
                              var IdDIreccion = this.DataInsert.Area
                                .IdDireccion;
                              var NombreDir = this.DataInsert.Area.Nombre;
                              this.solicitudComp
                                .getUserAutorizador(
                                  this.DataInsert.Area.IdDireccion,
                                  Role
                                )
                                .subscribe(
                                  (data) => {
                                    this.UsrAuthEmail = data;
                                    console.log(
                                      "------------------------------"
                                    );
                                    console.log(this.UsrAuthEmail[0]);
                                    console.log(
                                      "------------------0------------"
                                    );
                                    console.log(
                                      "Id de la DIreccion a enviar correo" +
                                        IdDIreccion
                                    );
                                    console.log(
                                      "Nombre de la DIrecion a la que se enviara mail--->" +
                                        NombreDir
                                    );
                                    this.toast.setMessage(
                                      "Envio de Solicitud Correcto. ",
                                      "success"
                                    );
                                    //si se guardo la Solicitud limpiamos los registros
                                    this.isEnviadoSolPed = false;
                                    this.date = "";
                                    this.usr.reset();
                                    this.puesto.reset();
                                    this.email.reset();
                                    this.tel.reset();
                                    this.ext.reset();
                                    this.nombreProduccion.reset();
                                    this.ngOnInit();
                                    this.addProdForm.reset();
                                    this.BloqMoreItem = false;
                                    var SendStatusMailAutorizacion = 0; //este numero cuatro se ponodra en el boton de autorizar para saber que autoriza direccion a nivel mail.
                                    var SendStatusmailRechazo = 0; //este numero se pondra en el boton de rechaar para saber que el directore rechaza la nueva solicitud desde el mail.
                                    //esta parte es para el envio de correo para el dir de area.
                                    this.solicitudComp
                                      .SendEmailNewSolicitud(
                                        res,
                                        status,
                                        IdDIreccion,
                                        NombreDir,
                                        Solicitante,
                                        this.UsrAuthEmail[0].IdRole,
                                        this.UsrAuthEmail[0].NombreCompleto,
                                        this.UsrAuthEmail[0].Email,
                                        SendStatusMailAutorizacion,
                                        SendStatusmailRechazo
                                      )
                                      .subscribe(
                                        (res) => {
                                          console.log(res);
                                          this.toast.setMessage(
                                            "Se realizo el envio del Email a Dir de Area",
                                            "success"
                                          );
                                        },
                                        (error) => {
                                          if(error.status == 403 || error.status == 404){
                                            this.toast.setMessage(
                                              error.message,
                                              "danger"
                                            );
                                            this.auth.logout();
                                          }
                                          console.log(error);
                                          //this.toast.setMessage('Error en el envio de el Correo','success');
                                        }
                                      );
                                  },
                                  (error) => {
                                    if(error.status == 403 || error.status == 404){
                                      this.toast.setMessage(
                                        error.message,
                                        "danger"
                                      );
                                      this.auth.logout();
                                    }
                                    console.log(
                                      "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                                        error
                                    );
                                  }
                                );
                            },
                            (error) => {
                              this.isEnviadoSolPed = false;
                              if(error.status == 403 || error.status == 404){
                                this.toast.setMessage(
                                  error.message,
                                  "danger"
                                );
                                this.auth.logout();
                              }
                              this.toast.setMessage(error.message, "danger");
                            }
                          );
                      }
                    } else {
                      console.log("seguimos el flujo normal de autorizaciones");
                      Role = 2;
                      status = 1;
                      this.DataInsert.TipoSolicitud = 5;
                      this.DataInsert.EstatusSol = status;
                      this.solicitudComp
                        .InsertSolicitudPedido1(this.DataInsert)
                        .subscribe(
                          (res) => {
                            // console.log("??????????????????????????????????????");
                            // console.log(res);
                            // console.log("??????????????????????????????????????");
                            console.log(this.DataInsert.Area.IdDireccion);
                            this.IdSoliforFile = res;
                            //se envia parametro de IdSOlicitud para identificar correctamente la cotizacion
                            this.uploader.options.headers = [];
                            this.uploader.options.headers.push({
                              name: "IdSol",
                              value: this.IdSoliforFile.toString(),
                            });
                            this.uploader.setOptions(this.uploader);
                            this.uploader.uploadAll();
                            console.log(Role);
                            console.log(status);
                            console.log(this.DataInsert.Area.IdDireccion);
                            var Solicitante = this.DataInsert.Usr;
                            var IdDIreccion = this.DataInsert.Area.IdDireccion;
                            var NombreDir = this.DataInsert.Area.Nombre;
                            this.solicitudComp
                              .getUserAutorizador(
                                this.DataInsert.Area.IdDireccion,
                                Role
                              )
                              .subscribe(
                                (data) => {
                                  this.UsrAuthEmail = data;
                                  console.log("------------------------------");
                                  console.log(this.UsrAuthEmail[0]);
                                  console.log(
                                    "------------------0------------"
                                  );
                                  console.log(
                                    "Id de la DIreccion a enviar correo" +
                                      IdDIreccion
                                  );
                                  console.log(
                                    "Nombre de la DIrecion a la que se enviara mail--->" +
                                      NombreDir
                                  );
                                  this.toast.setMessage(
                                    "Envio de Solicitud Correcto. ",
                                    "success"
                                  );
                                  //si se guardo la Solicitud limpiamos los registros
                                  this.isEnviadoSolPed = false;
                                  this.date = "";
                                  this.usr.reset();
                                  this.puesto.reset();
                                  this.email.reset();
                                  this.tel.reset();
                                  this.ext.reset();
                                  this.nombreProduccion.reset();
                                  this.ngOnInit();
                                  this.addProdForm.reset();
                                  this.BloqMoreItem = false;
                                  var SendStatusMailAutorizacion = 0; //este numero cuatro se ponodra en el boton de autorizar para saber que autoriza direccion a nivel mail.
                                  var SendStatusmailRechazo = 0; //este numero se pondra en el boton de rechaar para saber que el directore rechaza la nueva solicitud desde el mail.
                                  //esta parte es para el envio de correo para el dir de area.
                                  this.solicitudComp
                                    .SendEmailNewSolicitud(
                                      res,
                                      status,
                                      IdDIreccion,
                                      NombreDir,
                                      Solicitante,
                                      this.UsrAuthEmail[0].IdRole,
                                      this.UsrAuthEmail[0].NombreCompleto,
                                      this.UsrAuthEmail[0].Email,
                                      SendStatusMailAutorizacion,
                                      SendStatusmailRechazo
                                    )
                                    .subscribe(
                                      (res) => {
                                        console.log(res);
                                        this.toast.setMessage(
                                          "Se realizo el envio del Email a Dir de Area",
                                          "success"
                                        );
                                      },
                                      (error) => {
                                        if(error.status == 403 || error.status == 404){
                                          this.toast.setMessage(
                                            error.message,
                                            "danger"
                                          );
                                          this.auth.logout();
                                        }
                                        console.log(error);
                                        //this.toast.setMessage('Error en el envio de el Correo','success');
                                      }
                                    );
                                },
                                (error) => {
                                  if(error.status == 403 || error.status == 404){
                                    this.toast.setMessage(
                                      error.message,
                                      "danger"
                                    );
                                    this.auth.logout();
                                  }
                                  console.log(
                                    "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                                      error
                                  );
                                }
                              );
                          },
                          (error) => {
                            this.isEnviadoSolPed = false;
                            if(error.status == 403 || error.status == 404){
                              this.toast.setMessage(
                                error.message,
                                "danger"
                              );
                              this.auth.logout();
                            }
                            this.toast.setMessage(error.message, "danger");
                          }
                        );
                    }
                  },
                  (err) => {
                    console.log(
                      "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                        err
                    );
                  }
                );
            } else {
              this.toast.setMessage(
                "Existe un problema, favor de Validar Informacion ",
                "danger"
              );
            }
          }

          if (this.DataInsert.Imputacion.IdTipoSolicitud == 6) {
            console.log(
              "se cumple la condicion-------------6----------------CCosto--" +
                this.SelectedCostos +
                "------------OInvercion-" +
                this.SelectedOInvercion +
                "-------------OEstadistica-" +
                this.DataInsert.OrdenEstadistica +
                "-------------------CMayor--" +
                this.SelectedCMayor
            );
            if (
              this.SelectedCostos != undefined &&
              this.SelectedOInvercion == undefined &&
              this.DataInsert.OrdenEstadistica != undefined &&
              this.SelectedCMayor != undefined
              //&& valor.Material == undefined
              //&& valor.Almacen == undefined
              //&& this.Centro != undefined
              //&& valor.NumActivo == undefined
            ) {
              this.DataInsert.CentroCostos = this.SelectedCostos;
              this.DataInsert.OrdenInterna = this.SelectedOInvercion;
              this.DataInsert.Cuentamayor = this.SelectedCMayor;

              console.log("Iputacion G");
              this.DataInsert.Fecha = this.date;
              console.log(this.DataInsert.Fecha);
              this.DataInsert.Usr = this.usr.value;
              this.DataInsert.Puesto = this.puesto.value;
              this.DataInsert.Email = this.email.value;
              this.DataInsert.Tel = this.tel.value;
              this.DataInsert.Ext = this.ext.value;
              this.DataInsert.IdUsuario = this.auth.currentUser.IdUsuario;
              this.DataInsert.NombreProduccion = this.nombreProduccion.value;

              console.log("este es un tipo de solicitud --IMP G--");
              var Role;
              var status;
              this.solicitudComp
                .checkdirauthexeption(this.DataInsert.Area.IdDireccion)
                .subscribe(
                  (data) => {
                    if (data[0] != undefined || data[0] != null) {
                      console.log(
                        "validamos que tipo de esxcepcion se esta manejando"
                      );
                      if (data[0].IdRole == 2) {
                        console.log("Se excluye de la autorizacion a GERENTE");
                        Role = data[0].IdRole + 1;
                        status = data[0].IdRole;
                        this.DataInsert.TipoSolicitud = 6;
                        this.DataInsert.EstatusSol = status;
                        this.solicitudComp
                          .InsertSolicitudPedido1(this.DataInsert)
                          .subscribe(
                            (res) => {
                              // console.log("??????????????????????????????????????");
                              // console.log(res);
                              // console.log("??????????????????????????????????????");
                              console.log(this.DataInsert.Area.IdDireccion);
                              this.IdSoliforFile = res;
                              //se envia parametro de IdSOlicitud para identificar correctamente la cotizacion
                              this.uploader.options.headers = [];
                              this.uploader.options.headers.push({
                                name: "IdSol",
                                value: this.IdSoliforFile.toString(),
                              });
                              this.uploader.setOptions(this.uploader);
                              this.uploader.uploadAll();
                              console.log(Role);
                              console.log(status);
                              console.log(this.DataInsert.Area.IdDireccion);
                              var Solicitante = this.DataInsert.Usr;
                              var IdDIreccion = this.DataInsert.Area
                                .IdDireccion;
                              var NombreDir = this.DataInsert.Area.Nombre;
                              this.solicitudComp
                                .getUserAutorizador(
                                  this.DataInsert.Area.IdDireccion,
                                  Role
                                )
                                .subscribe(
                                  (data) => {
                                    this.UsrAuthEmail = data;
                                    console.log(
                                      "------------------------------"
                                    );
                                    console.log(this.UsrAuthEmail[0]);
                                    console.log(
                                      "------------------0------------"
                                    );
                                    console.log(
                                      "Id de la DIreccion a enviar correo" +
                                        IdDIreccion
                                    );
                                    console.log(
                                      "Nombre de la DIrecion a la que se enviara mail--->" +
                                        NombreDir
                                    );
                                    this.toast.setMessage(
                                      "Envio de Solicitud Correcto. ",
                                      "success"
                                    );
                                    //si se guardo la Solicitud limpiamos los registros
                                    this.isEnviadoSolPed = false;
                                    this.date = "";
                                    this.usr.reset();
                                    this.puesto.reset();
                                    this.email.reset();
                                    this.tel.reset();
                                    this.ext.reset();
                                    this.nombreProduccion.reset();
                                    this.ngOnInit();
                                    this.addProdForm.reset();
                                    this.BloqMoreItem = false;
                                    var SendStatusMailAutorizacion = 4; //este numero cuatro se ponodra en el boton de autorizar para saber que autoriza direccion a nivel mail.
                                    var SendStatusmailRechazo = 5; //este numero se pondra en el boton de rechaar para saber que el directore rechaza la nueva solicitud desde el mail.
                                    //esta parte es para el envio de correo para el dir de area.
                                    this.solicitudComp
                                      .SendEmailNewSolicitud(
                                        res,
                                        status,
                                        IdDIreccion,
                                        NombreDir,
                                        Solicitante,
                                        this.UsrAuthEmail[0].IdRole,
                                        this.UsrAuthEmail[0].NombreCompleto,
                                        this.UsrAuthEmail[0].Email,
                                        SendStatusMailAutorizacion,
                                        SendStatusmailRechazo
                                      )
                                      .subscribe(
                                        (res) => {
                                          console.log(res);
                                          this.toast.setMessage(
                                            "Se realizo el envio del Email a Dir de Area",
                                            "success"
                                          );
                                        },
                                        (error) => {
                                          if(error.status == 403 || error.status == 404){
                                            this.toast.setMessage(
                                              error.message,
                                              "danger"
                                            );
                                            this.auth.logout();
                                          }
                                          console.log(error);
                                          //this.toast.setMessage('Error en el envio de el Correo','success');
                                        }
                                      );
                                  },
                                  (error) => {
                                    if(error.status == 403 || error.status == 404){
                                      this.toast.setMessage(
                                        error.message,
                                        "danger"
                                      );
                                      this.auth.logout();
                                    }
                                    console.log(
                                      "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                                        error
                                    );
                                  }
                                );
                            },
                            (error) => {
                              this.isEnviadoSolPed = false;
                              if(error.status == 403 || error.status == 404){
                                this.toast.setMessage(
                                  error.message,
                                  "danger"
                                );
                                this.auth.logout();
                              }
                              this.toast.setMessage(error.message, "danger");
                            }
                          );
                      } else if (data[0].IdRole == 3) {
                        console.log(
                          "Se excluye dde la autorizaciones a DIRECTOR o SUBDIRECTOR"
                        );
                        Role = data[0].IdRole - 1;
                        status = data[0].IdRole - 2;
                        this.DataInsert.TipoSolicitud = 6;
                        this.DataInsert.EstatusSol = status;
                        this.solicitudComp
                          .InsertSolicitudPedido1(this.DataInsert)
                          .subscribe(
                            (res) => {
                              // console.log("??????????????????????????????????????");
                              // console.log(res);
                              // console.log("??????????????????????????????????????");
                              console.log(this.DataInsert.Area.IdDireccion);
                              this.IdSoliforFile = res;
                              //se envia parametro de IdSOlicitud para identificar correctamente la cotizacion
                              this.uploader.options.headers = [];
                              this.uploader.options.headers.push({
                                name: "IdSol",
                                value: this.IdSoliforFile.toString(),
                              });
                              this.uploader.setOptions(this.uploader);
                              this.uploader.uploadAll();
                              console.log(Role);
                              console.log(status);
                              console.log(this.DataInsert.Area.IdDireccion);
                              var Solicitante = this.DataInsert.Usr;
                              var IdDIreccion = this.DataInsert.Area
                                .IdDireccion;
                              var NombreDir = this.DataInsert.Area.Nombre;
                              this.solicitudComp
                                .getUserAutorizador(
                                  this.DataInsert.Area.IdDireccion,
                                  Role
                                )
                                .subscribe(
                                  (data) => {
                                    this.UsrAuthEmail = data;
                                    console.log(
                                      "------------------------------"
                                    );
                                    console.log(this.UsrAuthEmail[0]);
                                    console.log(
                                      "------------------0------------"
                                    );
                                    console.log(
                                      "Id de la DIreccion a enviar correo" +
                                        IdDIreccion
                                    );
                                    console.log(
                                      "Nombre de la DIrecion a la que se enviara mail--->" +
                                        NombreDir
                                    );
                                    this.toast.setMessage(
                                      "Envio de Solicitud Correcto. ",
                                      "success"
                                    );
                                    //si se guardo la Solicitud limpiamos los registros
                                    this.isEnviadoSolPed = false;
                                    this.date = "";
                                    this.usr.reset();
                                    this.puesto.reset();
                                    this.email.reset();
                                    this.tel.reset();
                                    this.ext.reset();
                                    this.nombreProduccion.reset();
                                    this.ngOnInit();
                                    this.addProdForm.reset();
                                    this.BloqMoreItem = false;
                                    var SendStatusMailAutorizacion = 0; //este numero cuatro se ponodra en el boton de autorizar para saber que autoriza direccion a nivel mail.
                                    var SendStatusmailRechazo = 0; //este numero se pondra en el boton de rechaar para saber que el directore rechaza la nueva solicitud desde el mail.
                                    //esta parte es para el envio de correo para el dir de area.
                                    this.solicitudComp
                                      .SendEmailNewSolicitud(
                                        res,
                                        status,
                                        IdDIreccion,
                                        NombreDir,
                                        Solicitante,
                                        this.UsrAuthEmail[0].IdRole,
                                        this.UsrAuthEmail[0].NombreCompleto,
                                        this.UsrAuthEmail[0].Email,
                                        SendStatusMailAutorizacion,
                                        SendStatusmailRechazo
                                      )
                                      .subscribe(
                                        (res) => {
                                          console.log(res);
                                          this.toast.setMessage(
                                            "Se realizo el envio del Email a Dir de Area",
                                            "success"
                                          );
                                        },
                                        (error) => {
                                          if(error.status == 403 || error.status == 404){
                                            this.toast.setMessage(
                                              error.message,
                                              "danger"
                                            );
                                            this.auth.logout();
                                          }
                                          console.log(error);
                                          //this.toast.setMessage('Error en el envio de el Correo','success');
                                        }
                                      );
                                  },
                                  (error) => {
                                    if(error.status == 403 || error.status == 404){
                                      this.toast.setMessage(
                                        error.message,
                                        "danger"
                                      );
                                      this.auth.logout();
                                    }
                                    console.log(
                                      "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                                        error
                                    );
                                  }
                                );
                            },
                            (error) => {
                              this.isEnviadoSolPed = false;
                              if(error.status == 403 || error.status == 404){
                                this.toast.setMessage(
                                  error.message,
                                  "danger"
                                );
                                this.auth.logout();
                              }
                              this.toast.setMessage(error.message, "danger");
                            }
                          );
                      }
                    } else {
                      console.log(
                        "seguimos con el flujo normal de la operacion"
                      );
                      Role = 2;
                      status = 1;
                      this.DataInsert.TipoSolicitud = 6;
                      this.DataInsert.EstatusSol = status;
                      this.solicitudComp.InsertSolicitudPedido1(this.DataInsert).subscribe(
                          (res) => {
                            // console.log("??????????????????????????????????????");
                            // console.log(res);
                            // console.log("??????????????????????????????????????");
                            console.log(this.DataInsert.Area.IdDireccion);
                            this.IdSoliforFile = res;
                            //se envia parametro de IdSOlicitud para identificar correctamente la cotizacion
                            this.uploader.options.headers = [];
                            this.uploader.options.headers.push({
                              name: "IdSol",
                              value: this.IdSoliforFile.toString(),
                            });
                            this.uploader.setOptions(this.uploader);
                            this.uploader.uploadAll();
                            console.log(Role);
                            console.log(status);
                            console.log(this.DataInsert.Area.IdDireccion);
                            var Solicitante = this.DataInsert.Usr;
                            var IdDIreccion = this.DataInsert.Area.IdDireccion;
                            var NombreDir = this.DataInsert.Area.Nombre;
                            this.solicitudComp
                              .getUserAutorizador(
                                this.DataInsert.Area.IdDireccion,
                                Role
                              )
                              .subscribe(
                                (data) => {
                                  this.UsrAuthEmail = data;
                                  console.log("------------------------------");
                                  console.log(this.UsrAuthEmail[0]);
                                  console.log(
                                    "------------------0------------"
                                  );
                                  console.log(
                                    "Id de la DIreccion a enviar correo" +
                                      IdDIreccion
                                  );
                                  console.log(
                                    "Nombre de la DIrecion a la que se enviara mail--->" +
                                      NombreDir
                                  );
                                  this.toast.setMessage(
                                    "Envio de Solicitud Correcto. ",
                                    "success"
                                  );
                                  //si se guardo la Solicitud limpiamos los registros
                                  this.isEnviadoSolPed = false;
                                  this.date = "";
                                  this.usr.reset();
                                  this.puesto.reset();
                                  this.email.reset();
                                  this.tel.reset();
                                  this.ext.reset();
                                  this.nombreProduccion.reset();
                                  this.ngOnInit();
                                  this.addProdForm.reset();
                                  this.BloqMoreItem = false;
                                  var SendStatusMailAutorizacion = 0; //este numero cuatro se ponodra en el boton de autorizar para saber que autoriza direccion a nivel mail.
                                  var SendStatusmailRechazo = 0; //este numero se pondra en el boton de rechaar para saber que el directore rechaza la nueva solicitud desde el mail.
                                  //esta parte es para el envio de correo para el dir de area.
                                  this.solicitudComp
                                    .SendEmailNewSolicitud(
                                      res,
                                      status,
                                      IdDIreccion,
                                      NombreDir,
                                      Solicitante,
                                      this.UsrAuthEmail[0].IdRole,
                                      this.UsrAuthEmail[0].NombreCompleto,
                                      this.UsrAuthEmail[0].Email,
                                      SendStatusMailAutorizacion,
                                      SendStatusmailRechazo
                                    )
                                    .subscribe(
                                      (res) => {
                                        console.log(res);
                                        this.toast.setMessage(
                                          "Se realizo el envio del Email a Dir de Area",
                                          "success"
                                        );
                                      },
                                      (error) => {
                                        if(error.status == 403 || error.status == 404){
                                          this.toast.setMessage(
                                            error.message,
                                            "danger"
                                          );
                                          this.auth.logout();
                                        }
                                        console.log(error);
                                        //this.toast.setMessage('Error en el envio de el Correo','success');
                                      }
                                    );
                                },
                                (error) => {
                                  if(error.status == 403 || error.status == 404){
                                    this.toast.setMessage(
                                      error.message,
                                      "danger"
                                    );
                                    this.auth.logout();
                                  }
                                  console.log(
                                    "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                                      error
                                  );
                                }
                              );
                          },
                          (error) => {
                            this.isEnviadoSolPed = false;
                            if(error.status == 403 || error.status == 404){
                              this.toast.setMessage(
                                error.message,
                                "danger"
                              );
                              this.auth.logout();
                            }
                            this.toast.setMessage(
                              "Ocurrio un Problema al Guardar tu Solicitud. Intenta de nuevo por favor ",
                              "danger"
                            );
                          }
                        );
                    }
                  },
                  (error) => {
                    if(error.status == 403 || error.status == 404){
                      this.toast.setMessage(
                        error.message,
                        "danger"
                      );
                      this.auth.logout();
                    }
                    console.log(
                      "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                        error
                    );
                  }
                );

              // console.log(this.DataInsert);
              // this.DataInsert.TipoSolicitud = 6;
              // this.solicitudComp.InsertSolicitudPedido1(this.DataInsert).subscribe(
              //   res => {
              //     // console.log("??????????????????????????????????????");
              //     // console.log(res);
              //     // console.log("??????????????????????????????????????");
              //     console.log(this.DataInsert.Area.IdDireccion);
              //     this.IdSoliforFile = res;
              //     var Role;
              //     var status;

              //     this.solicitudComp.checkdirauthexeption(this.DataInsert.Area.IdDireccion).subscribe(data =>{
              //       //se envia parametro de IdSOlicitud para identificar correctamente la cotizacion
              //     this.uploader.options.headers=[];
              //     this.uploader.options.headers.push({name:'IdSol', value:this.IdSoliforFile.toString()});
              //     this.uploader.setOptions(this.uploader);
              //     this.uploader.uploadAll();

              //       console.log(data[0]);
              //       console.log("¡¡¡?¡?¡?¡?¡?¡?¡?¡?¡?¡?¡?¡?¡?¡?¡?¡?");
              //       console.log(this.DataInsert.Area)
              //       if(data[0] != undefined || data[0] != null){
              //         Role = data[0].IdRole + 1;
              //         status = data[0].IdRole;
              //         console.log(Role);
              //         console.log(status);
              //         console.log(this.DataInsert.Area.IdDireccion);
              //         var Solicitante = this.DataInsert.Usr;
              //         var IdDIreccion = this.DataInsert.Area.IdDireccion;
              //         var NombreDir = this.DataInsert.Area.Nombre;
              //             this.solicitudComp.getUserAutorizador(this.DataInsert.Area.IdDireccion,Role).subscribe(data =>{
              //               this.UsrAuthEmail = data;
              //               console.log("------------------------------");
              //               console.log(this.UsrAuthEmail[0]);
              //               console.log("------------------0------------");
              //               console.log("Id de la DIreccion a enviar correo"+IdDIreccion);
              //               console.log("Nombre de la DIrecion a la que se enviara mail--->" + NombreDir);
              //               this.toast.setMessage('Envio de Solicitud Correcto. ', 'success');
              //               //si se guardo la Solicitud limpiamos los registros
              //               this.isEnviadoSolPed = false;
              //               this.date = '';
              //               this.usr.reset();
              //               this.puesto.reset();
              //               this.email.reset();
              //               this.tel.reset();
              //               this.ext.reset();
              //               this.nombreProduccion.reset();
              //               this.ngOnInit();
              //               this.addProdForm.reset();
              //               this.BloqMoreItem = false;
              //               //esta parte es para el envio de correo para el dir de area.
              //               this.solicitudComp.SendEmailNewSolicitud(res, status, IdDIreccion,  NombreDir, Solicitante, this.UsrAuthEmail[0].IdRole, this.UsrAuthEmail[0].NombreCompleto, this.UsrAuthEmail[0].Email )
              //               .subscribe( res =>{
              //                 console.log(res);
              //                 this.toast.setMessage('Se realizo el envio del Email a Dir de Area','success');
              //               }, err=>{
              //                 console.log(err);
              //                 //this.toast.setMessage('Error en el envio de el Correo','success');
              //               })
              //             },
              //             err=>{
              //               console.log("error al recuperar la informacion del usuario aotorizador por DIreccion" + err);
              //             });
              //       }else{
              //         Role = 2;
              //         status = 1;
              //         console.log(Role);
              //         console.log(status);
              //         console.log(this.DataInsert.Area.IdDireccion);
              //         var Solicitante = this.DataInsert.Usr;
              //         var IdDIreccion = this.DataInsert.Area.IdDireccion;
              //         var NombreDir = this.DataInsert.Area.Nombre;
              //             this.solicitudComp.getUserAutorizador(this.DataInsert.Area.IdDireccion,Role).subscribe(data =>{
              //               this.UsrAuthEmail = data;
              //               console.log("------------------------------");
              //               console.log(this.UsrAuthEmail[0]);
              //               console.log("------------------0------------");
              //               console.log("Id de la DIreccion a enviar correo"+IdDIreccion);
              //               console.log("Nombre de la DIrecion a la que se enviara mail--->" + NombreDir);
              //               this.toast.setMessage('Envio de Solicitud Correcto. ', 'success');
              //               //si no se ha enviado a guardar la SolPed a la base de datos el boton de subir cotizacion quedara inhablilitado
              //               this.isEnviadoSolPed = false;
              //               this.ngOnInit();
              //               //si se guardo la Solicitud limpiamos los registros
              //               this.date = '';
              //               this.usr.reset();
              //               this.puesto.reset();
              //               this.email.reset();
              //               this.tel.reset();
              //               this.ext.reset();
              //               this.nombreProduccion.reset();
              //               this.ngOnInit();
              //               this.addProdForm.reset();
              //               this.BloqMoreItem = false;
              //               //esta parte es para el envio de correo para el dir de area.
              //               this.solicitudComp.SendEmailNewSolicitud(res, status, IdDIreccion,  NombreDir, Solicitante, this.UsrAuthEmail[0].IdRole, this.UsrAuthEmail[0].NombreCompleto, this.UsrAuthEmail[0].Email )
              //               .subscribe( res =>{
              //                 console.log(res);
              //                 this.toast.setMessage('Se realizo el envio del Email a Dir de Area','success');

              //               }, err=>{
              //                 console.log(err);
              //                 //this.toast.setMessage('Error en el envio de el Correo','success');
              //               })
              //             },
              //             err=>{
              //               console.log("error al recuperar la informacion del usuario aotorizador por DIreccion" + err);
              //             });
              //       }
              //     }, err=>{
              //       console.log("error al recuperar la informacion de las Exxcepcions" + err );
              //     });
              //   },
              //   error => {
              //     this.isEnviadoSolPed = false;
              //     console.log(error)
              //     this.toast.setMessage('Ocurrio un Problema al Guardar tu Solicitud. Intenta de nuevo por favor ', 'danger');
              //   }
              // );
            } else {
              console.log("nada de nada mi niñooooooo");
            }
          }

          if (this.DataInsert.Imputacion.IdTipoSolicitud == 7) {
            console.log("Se cumple la condicion ------------7----------> ");
            console.log("CECOS" + this.SelectedCostos);
            console.log(this.SelectedCMayor);
            console.log(this.SelectedOInvercion);
            console.log("OR  H " + this.SelectedOrdenEstaHijo);
            console.log("CM  H " + this.SelectedCMayorHijo);
            console.log("CC  H " + this.SelectCentroCostosHijo);
            var datachild;
              this.DataInsert.Productos.forEach((element) => {
                console.log(element.ChildsProducts.length);
                if(element.ChildsProducts.length === 0 || element.ChildsProducts.length === undefined ||element.ChildsProducts.length === null){
                  datachild = 0;
                }
              });
            if (
              this.SelectedCostos == undefined &&
              this.SelectCentroCostosHijo != undefined &&
              this.SelectedOInvercion == undefined &&
              this.SelectedOrdenEstaHijo != undefined &&
              this.SelectedCMayor == undefined &&
              this.SelectedCMayorHijo != undefined &&
              datachild != 0
            ) {
              console.log(
                "--------------------------------Hacemos Insert de TipoSol 7--------------------------------------------------"
              );
              this.DataInsert.Fecha = this.date;
              this.DataInsert.Usr = this.usr.value;
              this.DataInsert.Puesto = this.puesto.value;
              this.DataInsert.Email = this.email.value;
              this.DataInsert.Tel = this.tel.value;
              this.DataInsert.Ext = this.ext.value;
              this.DataInsert.IdUsuario = this.auth.currentUser.IdUsuario;
              this.DataInsert.NombreProduccion = this.nombreProduccion.value;
              var Role;
              var status;
              this.solicitudComp
                .checkdirauthexeption(this.DataInsert.Area.IdDireccion)
                .subscribe(
                  (data) => {
                    if (data[0] != undefined || data[0] != null) {
                      console.log(
                        "validamos que tipo de esxcepcion se esta manejando"
                      );
                      if (data[0].IdRole == 2) {
                        console.log("Se excluye de la autorizacion a GERENTE");
                        Role = data[0].IdRole + 1;
                        status = data[0].IdRole;
                        this.DataInsert.TipoSolicitud = 7;
                        this.DataInsert.EstatusSol = status;
                        this.solicitudComp
                          .InsertSolicitudPedido1(this.DataInsert)
                          .subscribe(
                            (res) => {
                              // console.log("**********************");
                              // console.log(res);
                              // console.log("*************************");
                              //console.log(this.DataInsert.Area.IdDireccion);
                              this.IdSoliforFile = res;
                              this.uploader.options.headers = [];
                              this.uploader.options.headers.push({
                                name: "IdSol",
                                value: this.IdSoliforFile.toString(),
                              });
                              this.uploader.setOptions(this.uploader);
                              this.uploader.uploadAll();
                              console.log(Role);
                              console.log(status);
                              var Solicitante = this.DataInsert.Usr;
                              var IdDIreccion = this.DataInsert.Area
                                .IdDireccion;
                              var NombreDir = this.DataInsert.Area.Nombre;
                              this.solicitudComp
                                .getUserAutorizador(
                                  this.DataInsert.Area.IdDireccion,
                                  Role
                                )
                                .subscribe(
                                  (data) => {
                                    this.UsrAuthEmail = data;
                                    console.log(
                                      "------------------------------"
                                    );
                                    console.log(this.UsrAuthEmail[0]);
                                    console.log(
                                      "------------------0------------"
                                    );
                                    console.log(
                                      "Id de la DIreccion a enviar correo" +
                                        IdDIreccion
                                    );
                                    console.log(
                                      "Nombre de la DIrecion a la que se enviara mail--->" +
                                        NombreDir
                                    );
                                    this.toast.setMessage(
                                      "Envio de Solicitud Correcto. ",
                                      "success"
                                    );
                                    //si se guardo la Solicitud limpiamos los registros
                                    this.isEnviadoSolPed = false;
                                    this.date = "";
                                    this.usr.reset();
                                    this.puesto.reset();
                                    this.email.reset();
                                    this.tel.reset();
                                    this.ext.reset();
                                    this.nombreProduccion.reset();
                                    this.ngOnInit();
                                    this.addProdForm.reset();
                                    this.BloqMoreItem = false;
                                    var SendStatusMailAutorizacion = 4; //este numero cuatro se ponodra en el boton de autorizar para saber que autoriza direccion a nivel mail.
                                    var SendStatusmailRechazo = 5; //este numero se pondra en el boton de rechaar para saber que el directore rechaza la nueva solicitud desde el mail.
                                    //esta parte es para el envio de correo para el dir de area.
                                    this.solicitudComp
                                      .SendEmailNewSolicitud(
                                        res,
                                        status,
                                        IdDIreccion,
                                        NombreDir,
                                        Solicitante,
                                        this.UsrAuthEmail[0].IdRole,
                                        this.UsrAuthEmail[0].NombreCompleto,
                                        this.UsrAuthEmail[0].Email,
                                        SendStatusMailAutorizacion,
                                        SendStatusmailRechazo
                                      )
                                      .subscribe(
                                        (res) => {
                                          console.log(res);
                                          this.toast.setMessage(
                                            "Se realizo el envio del Email a Dir de Area",
                                            "success"
                                          );
                                        },
                                        (error) => {
                                          if(error.status == 403 || error.status == 404){
                                            this.toast.setMessage(
                                              error.message,
                                              "danger"
                                            );
                                            this.auth.logout();
                                          }
                                          console.log(error);
                                          //this.toast.setMessage('Error en el envio de el Correo','success');
                                        }
                                      );
                                  },
                                  (error) => {
                                    if(error.status == 403 || error.status == 404){
                                      this.toast.setMessage(
                                        error.message,
                                        "danger"
                                      );
                                      this.auth.logout();
                                    }
                                    console.log(
                                      "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                                      error
                                    );
                                  }
                                );
                            },
                            (error) => {
                              this.isEnviadoSolPed = false;
                              if(error.status == 403 || error.status == 404){
                                this.toast.setMessage(
                                  error.message,
                                  "danger"
                                );
                                this.auth.logout();
                              }
                              this.toast.setMessage(error.message, "danger");
                            }
                          );
                      } else if (data[0].IdRole == 3) {
                        console.log(
                          "Se excluye dde la autorizaciones a DIRECTOR o SUBDIRECTOR"
                        );
                        Role = data[0].IdRole - 1;
                        status = data[0].IdRole - 2;
                        this.DataInsert.TipoSolicitud = 7;
                        this.DataInsert.EstatusSol = status;
                        this.solicitudComp
                          .InsertSolicitudPedido1(this.DataInsert)
                          .subscribe(
                            (res) => {
                              // console.log("**********************");
                              // console.log(res);
                              // console.log("*************************");
                              //console.log(this.DataInsert.Area.IdDireccion);
                              this.IdSoliforFile = res;
                              this.uploader.options.headers = [];
                              this.uploader.options.headers.push({
                                name: "IdSol",
                                value: this.IdSoliforFile.toString(),
                              });
                              this.uploader.setOptions(this.uploader);
                              this.uploader.uploadAll();
                              console.log(Role);
                              console.log(status);
                              var Solicitante = this.DataInsert.Usr;
                              var IdDIreccion = this.DataInsert.Area
                                .IdDireccion;
                              var NombreDir = this.DataInsert.Area.Nombre;
                              this.solicitudComp
                                .getUserAutorizador(
                                  this.DataInsert.Area.IdDireccion,
                                  Role
                                )
                                .subscribe(
                                  (data) => {
                                    this.UsrAuthEmail = data;
                                    console.log(
                                      "------------------------------"
                                    );
                                    console.log(this.UsrAuthEmail[0]);
                                    console.log(
                                      "------------------0------------"
                                    );
                                    console.log(
                                      "Id de la DIreccion a enviar correo" +
                                        IdDIreccion
                                    );
                                    console.log(
                                      "Nombre de la DIrecion a la que se enviara mail--->" +
                                        NombreDir
                                    );
                                    this.toast.setMessage(
                                      "Envio de Solicitud Correcto. ",
                                      "success"
                                    );
                                    //si se guardo la Solicitud limpiamos los registros
                                    this.isEnviadoSolPed = false;
                                    this.date = "";
                                    this.usr.reset();
                                    this.puesto.reset();
                                    this.email.reset();
                                    this.tel.reset();
                                    this.ext.reset();
                                    this.nombreProduccion.reset();
                                    this.ngOnInit();
                                    this.addProdForm.reset();
                                    this.BloqMoreItem = false;
                                    var SendStatusMailAutorizacion = 0; //este numero cuatro se ponodra en el boton de autorizar para saber que autoriza direccion a nivel mail.
                                    var SendStatusmailRechazo = 0; //este numero se pondra en el boton de rechaar para saber que el directore rechaza la nueva solicitud desde el mail.
                                    //esta parte es para el envio de correo para el dir de area.
                                    this.solicitudComp
                                      .SendEmailNewSolicitud(
                                        res,
                                        status,
                                        IdDIreccion,
                                        NombreDir,
                                        Solicitante,
                                        this.UsrAuthEmail[0].IdRole,
                                        this.UsrAuthEmail[0].NombreCompleto,
                                        this.UsrAuthEmail[0].Email,
                                        SendStatusMailAutorizacion,
                                        SendStatusmailRechazo
                                      )
                                      .subscribe(
                                        (res) => {
                                          console.log(res);
                                          this.toast.setMessage(
                                            "Se realizo el envio del Email a Dir de Area",
                                            "success"
                                          );
                                        },
                                        (error) => {
                                          if(error.status == 403 || error.status == 404){
                                            this.toast.setMessage(
                                              error.message,
                                              "danger"
                                            );
                                            this.auth.logout();
                                          }
                                          console.log(error);
                                          //this.toast.setMessage('Error en el envio de el Correo','success');
                                        }
                                      );
                                  },
                                  (error) => {
                                    if(error.status == 403 || error.status == 404){
                                      this.toast.setMessage(
                                        error.message,
                                        "danger"
                                      );
                                      this.auth.logout();
                                    }
                                    console.log(
                                      "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                                        error
                                    );
                                  }
                                );
                            },
                            (error) => {
                              this.isEnviadoSolPed = false;
                              if(error.status == 403 || error.status == 404){
                                this.toast.setMessage(
                                  error.message,
                                  "danger"
                                );
                                this.auth.logout();
                              }
                              this.toast.setMessage(error.message, "danger");
                            }
                          );
                      }
                    } else {
                      console.log(
                        "seguimos con el flujo normal de las autorizaciones"
                      );
                      Role = 2;
                      status = 1;
                      this.DataInsert.TipoSolicitud = 7;
                      this.DataInsert.EstatusSol = status;
                      this.solicitudComp
                        .InsertSolicitudPedido1(this.DataInsert)
                        .subscribe(
                          (res) => {
                            // console.log("**********************");
                            // console.log(res);
                            // console.log("*************************");
                            //console.log(this.DataInsert.Area.IdDireccion);
                            this.IdSoliforFile = res;
                            this.uploader.options.headers = [];
                            this.uploader.options.headers.push({
                              name: "IdSol",
                              value: this.IdSoliforFile.toString(),
                            });
                            this.uploader.setOptions(this.uploader);
                            this.uploader.uploadAll();
                            console.log(Role);
                            console.log(status);
                            var Solicitante = this.DataInsert.Usr;
                            var IdDIreccion = this.DataInsert.Area.IdDireccion;
                            var NombreDir = this.DataInsert.Area.Nombre;
                            this.solicitudComp
                              .getUserAutorizador(
                                this.DataInsert.Area.IdDireccion,
                                Role
                              )
                              .subscribe(
                                (data) => {
                                  this.UsrAuthEmail = data;
                                  console.log("------------------------------");
                                  console.log(this.UsrAuthEmail[0]);
                                  console.log(
                                    "------------------0------------"
                                  );
                                  console.log(
                                    "Id de la DIreccion a enviar correo" +
                                      IdDIreccion
                                  );
                                  console.log(
                                    "Nombre de la DIrecion a la que se enviara mail--->" +
                                      NombreDir
                                  );
                                  this.toast.setMessage(
                                    "Envio de Solicitud Correcto. ",
                                    "success"
                                  );
                                  //si se guardo la Solicitud limpiamos los registros
                                  this.isEnviadoSolPed = false;
                                  this.date = "";
                                  this.usr.reset();
                                  this.puesto.reset();
                                  this.email.reset();
                                  this.tel.reset();
                                  this.ext.reset();
                                  this.nombreProduccion.reset();
                                  this.ngOnInit();
                                  this.addProdForm.reset();
                                  this.BloqMoreItem = false;
                                  var SendStatusMailAutorizacion = 0; //este numero cuatro se ponodra en el boton de autorizar para saber que autoriza direccion a nivel mail.
                                  var SendStatusmailRechazo = 0; //este numero se pondra en el boton de rechaar para saber que el directore rechaza la nueva solicitud desde el mail.
                                  //esta parte es para el envio de correo para el dir de area.
                                  this.solicitudComp
                                    .SendEmailNewSolicitud(
                                      res,
                                      status,
                                      IdDIreccion,
                                      NombreDir,
                                      Solicitante,
                                      this.UsrAuthEmail[0].IdRole,
                                      this.UsrAuthEmail[0].NombreCompleto,
                                      this.UsrAuthEmail[0].Email,
                                      SendStatusMailAutorizacion,
                                      SendStatusmailRechazo
                                    )
                                    .subscribe(
                                      (res) => {
                                        console.log(res);
                                        this.toast.setMessage(
                                          "Se realizo el envio del Email a Dir de Area",
                                          "success"
                                        );
                                      },
                                      (error) => {
                                        if(error.status == 403 || error.status == 404){
                                          this.toast.setMessage(
                                            error.message,
                                            "danger"
                                          );
                                          this.auth.logout();
                                        }
                                        console.log(error);
                                        //this.toast.setMessage('Error en el envio de el Correo','success');
                                      }
                                    );
                                },
                                (error) => {
                                  if(error.status == 403 || error.status == 404){
                                    this.toast.setMessage(
                                      error.message,
                                      "danger"
                                    );
                                    this.auth.logout();
                                  }
                                  console.log(
                                    "error al recuperar la informacion del usuario aotorizador por DIreccion" +
                                      error
                                  );
                                }
                              );
                          },
                          (error) => {
                            this.isEnviadoSolPed = false;
                            if(error.status == 403 || error.status == 404){
                              this.toast.setMessage(
                                error.message,
                                "danger"
                              );
                              this.auth.logout();
                            }
                            this.toast.setMessage(error.message, "danger");
                          }
                        );
                    }
                  },
                  (error) => {
                    if(error.status == 403 || error.status == 404){
                      this.toast.setMessage(
                        error.message,
                        "danger"
                      );
                      this.auth.logout();
                    }
                    console.log(
                      "error al recuperar la informacion de las Exxcepcions" +
                        error
                    );
                  }
                );

              // this.DataInsert.TipoSolicitud = 7;
              // this.solicitudComp.InsertSolicitudPedido1(this.DataInsert).subscribe(
              //   res => {
              //     // console.log("**********************");
              //     // console.log(res);
              //     // console.log("*************************");
              //     //console.log(this.DataInsert.Area.IdDireccion);
              //     this.IdSoliforFile = res;
              //     var Role;
              //     var status;

              //     this.solicitudComp.checkdirauthexeption(this.DataInsert.Area.IdDireccion).subscribe(data =>{
              //         //se envia parametro de IdSOlicitud para identificar correctamente la cotizacion
              //         this.uploader.options.headers=[];
              //         this.uploader.options.headers.push({name:'IdSol', value:this.IdSoliforFile.toString()});
              //         this.uploader.setOptions(this.uploader);
              //         this.uploader.uploadAll();
              //       console.log(data[0]);
              //       console.log("¡¡¡?¡?¡?¡?¡?¡?¡?¡?¡?¡?¡?¡?¡?¡?¡?¡?");
              //       console.log(this.DataInsert.Area.IdDireccion);
              //       if(data[0] != undefined || data[0] != null){
              //         Role = data[0].IdRole + 1;
              //         status = data[0].IdRole;
              //         console.log(Role);
              //         console.log(status);
              //         //console.log(this.DataInsert.Area.IdDireccion);
              //         var Solicitante = this.DataInsert.Usr;
              //         var IdDIreccion = this.DataInsert.Area.IdDireccion;
              //         var NombreDir = this.DataInsert.Area.Nombre;
              //             this.solicitudComp.getUserAutorizador(this.DataInsert.Area.IdDireccion,Role).subscribe(data =>{
              //               this.UsrAuthEmail = data;
              //               console.log("------------------------------");
              //               console.log(this.UsrAuthEmail[0]);
              //               console.log("------------------0------------");
              //               console.log("Id de la DIreccion a enviar correo"+IdDIreccion);
              //               console.log("Nombre de la DIrecion a la que se enviara mail--->" + NombreDir);
              //               this.toast.setMessage('Envio de Solicitud Correcto. ', 'success');
              //               //si se guardo la Solicitud limpiamos los registros
              //               this.isEnviadoSolPed = false;
              //               this.date = '';
              //               this.usr.reset();
              //               this.puesto.reset();
              //               this.email.reset();
              //               this.tel.reset();
              //               this.ext.reset();
              //               this.nombreProduccion.reset();
              //               this.ngOnInit();
              //               this.addProdForm.reset();
              //               this.BloqMoreItem = false;
              //               //esta parte es para el envio de correo para el dir de area.
              //               this.solicitudComp.SendEmailNewSolicitud(res, status, IdDIreccion,  NombreDir, Solicitante, this.UsrAuthEmail[0].IdRole, this.UsrAuthEmail[0].NombreCompleto, this.UsrAuthEmail[0].Email )
              //               .subscribe( res =>{
              //                 console.log(res);
              //                 this.toast.setMessage('Se realizo el envio del Email a Dir de Area','success');
              //               }, err=>{
              //                 console.log(err);
              //                 //this.toast.setMessage('Error en el envio de el Correo','success');
              //               })
              //             },
              //             err=>{
              //               console.log("error al recuperar la informacion del usuario aotorizador por DIreccion" + err);
              //             });
              //       }else{
              //             Role = 2;
              //             status = 1;
              //             console.log(Role);
              //             console.log(status);
              //             console.log(this.DataInsert.Area.IdDireccion);
              //             var Solicitante = this.DataInsert.Usr;
              //             var IdDIreccion = this.DataInsert.Area.IdDireccion;
              //             var NombreDir = this.DataInsert.Area.Nombre;
              //                 this.solicitudComp.getUserAutorizador(this.DataInsert.Area.IdDireccion,Role).subscribe(data =>{
              //                   this.UsrAuthEmail = data;
              //                   console.log("------------------------------");
              //                   console.log(this.UsrAuthEmail[0]);
              //                   console.log("------------------0------------");
              //                   console.log("Id de la DIreccion a enviar correo"+IdDIreccion);
              //                   console.log("Nombre de la DIrecion a la que se enviara mail--->" + NombreDir);
              //                   this.toast.setMessage('Envio de Solicitud Correcto. ', 'success');
              //                   //si no se ha enviado a guardar la SolPed a la base de datos el boton de subir cotizacion quedara inhablilitado
              //                   this.isEnviadoSolPed = false;
              //                   this.ngOnInit();
              //                   //si se guardo la Solicitud limpiamos los registros
              //                   this.date = '';
              //                   this.usr.reset();
              //                   this.puesto.reset();
              //                   this.email.reset();
              //                   this.tel.reset();
              //                   this.ext.reset();
              //                   this.nombreProduccion.reset();
              //              F     this.ngOnInit();
              //                   this.addProdForm.reset();
              //                   this.BloqMoreItem = false;
              //                   //esta parte es para el envio de correo para el dir de area.
              //                   this.solicitudComp.SendEmailNewSolicitud(res, status, IdDIreccion,  NombreDir, Solicitante, this.UsrAuthEmail[0].IdRole, this.UsrAuthEmail[0].NombreCompleto, this.UsrAuthEmail[0].Email )
              //                   .subscribe( res =>{
              //                     console.log(res);
              //                     this.toast.setMessage('Se realizo el envio del Email a Dir de Area','success');

              //                   }, err=>{
              //                     console.log(err);
              //                     //this.toast.setMessage('Error en el envio de el Correo','success');
              //                   })
              //                 },
              //                 err=>{
              //                   console.log("error al recuperar la informacion del usuario aotorizador por DIreccion" + err);
              //                 });
              //       }
              //     }, err=>{
              //       console.log("error al recuperar la informacion de las Exxcepcions" + err );
              //     });

              //   },
              //   error => {
              //     this.isEnviadoSolPed = false;
              //     console.log(error)
              //     this.toast.setMessage('Ocurrio un Problema al Guardar tu Solicitud. Intenta de nuevo por favor '+ error, 'danger');
              //   }
              // );
            } else {
              console.log("intento faillido");
              this.toast.setMessage(
                "Ocurrio un problema al enviar la solicitud, Por Favor verifica la informacion ",
                "danger"
              );
            }
          }

          
        } else {
          this.toast.setMessage(
            "Una Solicitud de Tipo Servicio debe contener un Sub Producto, favor de validar informacion",
            "warning"
          );
        }
      } else {
        if (this.uploader.queue.length > 1) {
          this.toast.setMessage(
            "La solicitud de pedido solo debe contener un archivo de precotizacion.",
            "warning"
          );
        } else if (this.uploader.queue.length == 0) {
          this.toast.setMessage(
            "Se debe adjuntar una precotizacion para crear una nueva Solicitud de Pedido.",
            "warning"
          );
        }
      }
    }
  }

  //validacion de campos
  RemoveCaracteresEpeciales(str) {
    var j: number;

    //console.log(str)
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
      to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
      mapping = {};

    for (var i = 0, j = from.length; i < j; i++)
      mapping[from.charAt(i)] = to.charAt(i);

    var ret = [];

    for (var i = 0, tamaño = str.length; i < tamaño; i++) {
      var c = str.charAt(i);
      //console.log(tamaño);
      if (mapping.hasOwnProperty(str.charAt(i))) ret.push(mapping[c]);
      else ret.push(c);
    }
    //console.log(ret.join( '' ).toString());
    return ret.join("").toString();
  }

  //Mensajes de validacion

  getErrorMessage() {
    return this.email.hasError("required")
      ? "Debes ingresar un valor"
      : this.email.hasError("email")
      ? "email invalido"
      : "";
  }
  getErrorMensajeExt() {
    return this.ext.hasError("")
      ? "El campo no puede estar vacion"
      : this.ext.hasError("maxLength")
      ? "Extencion invalida"
      : "";
  }
  getErrorMensajeTel() {
    return this.tel.hasError("required")
      ? "El campo no Puede estar vacio "
      : "";
  }
  getErrorMensajeInt() {
    return this.precio.hasError("required")
      ? "El campo no Puede estar vacio "
      : "";
  }
  getErrorMensajeUsuario() {
    return this.usr.hasError("required")
      ? "El campo no Puede estar vacio y debe ser mayor a 8 caracteres"
      : "";
  }
  getErrorMensajeArea() {
    return this.area.hasError("required")
      ? "El campo no Puede estar vacio "
      : "";
  }
  // getErrorMensajeNProducc(){
  //   return this.nombreProduccion.hasError('required') ? 'El campo no Puede estar vacio ': '';
  // }
}
