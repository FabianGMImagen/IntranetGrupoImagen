import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { MatPaginatorIntl, PageEvent } from "@angular/material/paginator";
import {
  merge,
  Observable,
  of as observableOf,
  ReplaySubject,
  Subject,
} from "rxjs";
import {
  formatCurrency,
  getCurrencySymbol,
  DecimalPipe,
} from "@angular/common";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

import {
  catchError,
  map,
  startWith,
  switchMap,
  takeUntil,
} from "rxjs/operators";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import * as jsPDF from "jspdf";

import { ToastComponent } from "../../shared/toast/toast.component";
import { AuthServices } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { SolicitudCompraService } from "../../services/solicitudcompra.service";
import { Detallesol } from "../../shared/models/detallesol.model";

import { Empresa } from "../../shared/models/empresa.model";
import { Imputacion } from "../../shared/models/imputacion.model";
import { OrdenInterna } from "../../shared/models/ordeninterna.model";
import { User } from "../../shared/models/user.model";
import { SolicitudesCompraRegistradas } from "../../shared/models/solicitudcompraRegistradas.model";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { ChangeDetectorRef } from "@angular/core";
import { Childs } from "../../shared/models/childs.model";
import { SucursalPlaza } from "../../shared/models/sucursalplaza.model";
import { Almacen } from "../../shared/models/almacen.model";
import { FormControl } from "@angular/forms";
import { Materiales } from "../../shared/models/materiales.model";
import { CentroCostos } from "../../shared/models/centrocostos.model";
import { CuentaMayor } from "../../shared/models/cuentamayor.model";
import { GrupoCompra } from "../../shared/models/grupocompra.model";
import { UnidadMedida } from "../../shared/models/umedida.model";
import { Necesidad } from "../../shared/models/necesidad.model";
import { Activo } from "../../shared/models/activo.model";
import { DialogAdvertenciaUpdateSolpedidoComponent } from "client/app/dialogs/dialog-advertencia-update-solpedido/dialog-advertencia-update-solpedido.component";



@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.css"],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class AccountComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  protected ListAlmacen: Almacen[];
  public AlmacenCrtl: FormControl = new FormControl();
  public AlmacenFilterCtrl: FormControl = new FormControl();
  public filteredAlmacen: ReplaySubject<Almacen[]> = new ReplaySubject<
    Almacen[]
  >(1);

  protected ListMateriales: Materiales[];
  public MaterialesCtrl: FormControl = new FormControl();
  public MaterialesFilterCtrl: FormControl = new FormControl();
  public filteredMaterial: ReplaySubject<Materiales[]> = new ReplaySubject<
    Materiales[]
  >(1);

  protected ListCCostos: CentroCostos[];
  public CCostosCrtl: FormControl = new FormControl();
  public CCosotosFilterCtrl: FormControl = new FormControl();
  public filteredCCostos: ReplaySubject<CentroCostos[]> = new ReplaySubject<
    CentroCostos[]
  >(1);

  protected ListCmayor: CuentaMayor[];
  public CMayorCtrl: FormControl = new FormControl();
  public CMayorFilterCtrl: FormControl = new FormControl();
  public filteredCMayor: ReplaySubject<CuentaMayor[]> = new ReplaySubject<
    CuentaMayor[]
  >(1);

  protected ListGrupoCompra: GrupoCompra[];
  public GCompraCtrl: FormControl = new FormControl();
  public GCompraFilterCtrl: FormControl = new FormControl();
  public filteredGCompra: ReplaySubject<GrupoCompra[]> = new ReplaySubject<
    GrupoCompra[]
  >(1);

  protected ListUnidadMedida: UnidadMedida[];
  public UnidadMedidaCtrl: FormControl = new FormControl();
  public UnidadMedidaFilterCtrl: FormControl = new FormControl();
  public filteredUnidadMedida: ReplaySubject<UnidadMedida[]> =
    new ReplaySubject<UnidadMedida[]>(1);

  protected ListOrdEstadistica: OrdenInterna[];
  public OrdenEstadisticaCrtl: FormControl = new FormControl();
  public OrdenEstadisticaFilterCtrl: FormControl = new FormControl();
  public filteredOrdenEstadistica: ReplaySubject<OrdenInterna[]> =
    new ReplaySubject<OrdenInterna[]>(1);

  protected ListActivo: Activo[];
  public ActivoCrtl: FormControl = new FormControl();
  public ActivoFilterCtrl: FormControl = new FormControl();
  public filteredActivo: ReplaySubject<Activo[]> = new ReplaySubject<Activo[]>(
    1
  );

  protected _onDestroy = new Subject<void>();
  public kalssforstatus = {};
  //     {newsc: 'S. P. NUEVA PETICION',
  // aut: 'S. P. AUTORIZADO POR GERENTE',
  // rech :  'S. P. RECHAZADA POR GERENTE',
  // //aut : 'S. P. AUTORIZADO POR DIRECCION',
  // //rech :  'S. P. RECHAZADA POR DIRECCION',
  // //aut: 'S. P. PRESUPUESTO AUTORIZADO',
  // //rech : 'S. P. PRESUPUESTO RECHAZADO',
  // //aut : 'S. P. REVISADA POR COMPRAS',
  // //rech : 'S. P. RECHAZADA POR COMPRAS',
  // carsap : 'S. P. CARGADA EN ARCHIVO Y ENVIADA A SAP',
  // //rech : 'S. P. CANCELADA',
  // fin: 'CONTRATO MARCO'}

  CheckSolicitud: number = undefined;

  user: User;
  isLoading = true;

  usr: number;
  direccion: number;
  role: number;

  DataSolReg: SolicitudesCompraRegistradas;
  ListSolCompReg: SolicitudesCompraRegistradas[];
  ListDetallesol: Detallesol[];
  ListChilds: Childs[];
  DatosSubProd: Childs = new Childs();

  DataSource: MatTableDataSource<SolicitudesCompraRegistradas>;
  columnsToDisplay = [
    "ID",
    "FECHASOLICITUD",
    "TSNOMBRE",
    "REQUIRENTE",
    "EMPRESA",
  ];

  //tabla de detalle de Solicitud
  displayedColumns = [
    "CANTIDAD",
    "MEDIDA",
    "BIENOSERV",
    "PRECIO",
    "CECO",
    "CMAYOR",
    "OIN",
    "ACTFIJ",
  ];
  dataSource: MatTableDataSource<Detallesol>;

  //creamos una tabla nueva para los Hijos de los Items
  childsColumns = [
    "CantidadChild",
    "PrecioChild",
    "NameOrdenEstadisticaChild",
    "NameUnidadMedidaChild",
    "NameCentroCostosChild",
    "NameCuentaMayorChild",
    "TextoBreve",
  ];
  dataChilds: MatTableDataSource<Childs>;

  genPDF = false;
  //para saber si es usuario solicitante y muestra
  editSol = false;
  //variable para ocultar la vista principal
  viewcoutn = true;
  //variable para ocultar o mostrar la vista de edicion de Solicitud
  isViewEditingSol = false;
  //variable para ocultar el boton de guardar cambios al editar la Solicitud
  isviewEdit = false;
  isviewChilds = false;

  viewChilds: boolean;

  buttonChild: boolean = false;

  /*---DATOS PARA LA EDICION DE LA SOLICTUD A NIVEL SOLICITU----*/
  ListOrdenInterna: OrdenInterna[];
  SelectedOInvercion: OrdenInterna;
  iseditsolped: boolean = false;
  iseditproduct: boolean = false;
  iseditproductbutton: boolean = false;
  iseditchilds: boolean = false;

  empresa: Empresa;
  tiposol: Imputacion;
  requirente: string;
  puesto: string;
  email: string;
  tel: string;
  ext: string;
  produccion: string;
  justificacion: string;
  /*datos de productos*/
  detalle_producto: Detallesol;
  precio: number;
  priceS = "";
  cantidad: number;
  plaza: SucursalPlaza;

  SelectedAlmacen: Almacen;
  SelectedMaterial: Materiales;
  SelectedCentroCost: CentroCostos;
  SelectedCuentaMayor: CuentaMayor;
  SelectedGrupoComp: GrupoCompra;
  SelectedUnidadMed: UnidadMedida;
  SelectOrdenEstadisitica: OrdenInterna;
  SelectedNumActivo: Activo;
  ListNecesidad: Necesidad[];
  SelectedNecesidad: Necesidad;
  Espesificaciones: string;
  UsoBien: string;
  isCantidad: boolean = false;
  isPrecio: boolean = false;
  AplicaCenCost: boolean = false;
  AplicaCtaMayor: boolean = false;
  AplicaMat: boolean = false;
  AplicaAlma: boolean = false;
  AplicaNumActivo: boolean = false;
  AplicaUsobien: boolean = false;
  AplicaUMedida: boolean = false;
  isOrdEstadistica: boolean = false;
  /*finde los datos de productos*/

  /*Datos editables a nivel sub productos*/
  iseditsubProduct: boolean = false;
  detalle_subproducts: Childs;
  isOrdenEstadisticaChild: boolean = false;
  cantidadchild: number;
  preciochild: number;
  SelectOrdenEstadisiticaChild: OrdenInterna;
  SelectedUnidadMedChild: UnidadMedida;
  SelectedCentroCostChild: CentroCostos;
  SelectedCuentaMayorChild: CuentaMayor;
  textbreve: string;
  /*fin de datos editables a sub productos */

  /*BLoqueo de campos con variables*/
  AplicaOrdInt: boolean = false;
  /*---fin de datos editables---*/
  newStatus: number = undefined;
  isload: boolean = false;
  openedDataSol:boolean=false;
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.DataSource.filter = filterValue;
    if (this.DataSource.paginator) {
      this.DataSource.paginator.firstPage();
    }
  }

  constructor(
    
    private auth: AuthServices,
    public toast: ToastComponent,
    public cdr: ChangeDetectorRef,
    private solicitudComp: SolicitudCompraService,
    private userService: UserService,
    private pagin: MatPaginatorIntl,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.openedDataSol=false;
    this.SelectedAlmacen = new Almacen();
    this.SelectedMaterial = new Materiales();
    this.SelectedCentroCost = new CentroCostos();
    this.SelectedCuentaMayor = new CuentaMayor();
    this.SelectedGrupoComp = new GrupoCompra();
    this.SelectedUnidadMed = new UnidadMedida();
    this.SelectOrdenEstadisitica = new OrdenInterna();
    this.SelectedNumActivo = new Activo();
    this.SelectedNecesidad = new Necesidad();
    this.pagin.itemsPerPageLabel = "REGISTROS POR PAGINA";

    /*incializamos datos de sub Hijos*/
    this.SelectedUnidadMedChild = new UnidadMedida();
    this.SelectOrdenEstadisiticaChild = new OrdenInterna();
    this.SelectedCentroCostChild = new CentroCostos();
    this.SelectedCuentaMayorChild = new CuentaMayor();

    this.getAllSolicitudforUser();
    this.SelectedOInvercion = new OrdenInterna();
    if (
      this.auth.currentUser.IdRole == 2 ||
      this.auth.currentUser.IdRole == 3 ||
      this.auth.currentUser.IdRole == 4
    ) {
      this.editSol = false;
    } else {
      this.editSol = true;
    }
  }

  // setStep(index: number) {
  //   this.openedDataSol = index;
  // }

  //solo aplica para usuario solicitante
  getAllSolicitudforUser() {
    console.log(this.auth.currentUser.IdUsuario);
    //console.log(thi s.auth.currentUser.LoginName);
    //console.log(this.auth.currentUser.IdDireccion);
    //console.log(this.auth.currentUser.IdRole);
    this.isload = true;
    this.usr = this.auth.currentUser.IdUsuario;
    //this.direccion = this.auth.currentUser.IdDireccion;
    this.role = this.auth.currentUser.IdRole;
    //console.log("Usuario Solicitante");
    this.solicitudComp.getAllSolicitudforusr(this.usr, this.role).subscribe(
      (data) => {
        this.ListSolCompReg = data;
        if (this.ListSolCompReg.length == 0) {
          this.toast.setMessage(
            "Aun no has generado ninguna Sol. de Pedido",
            "warning"
          );
        }
        this.getcssclas();
        this.DataSource = new MatTableDataSource(this.ListSolCompReg);
        this.isload = false;
      },
      (error) => {
        console.log(error);
        this.toast.setMessage(error.message, "danger");
        this.isload = false;
        if (error.status == 403 || error.status == 404) {
          this.toast.setMessage(error.message, "danger");
          this.auth.logout();
        }
      },
      () => {
        //console.log("entrando al lugar donde se hace la paginacion--------------------");
        //console.log(this.ListSolCompReg);
        this.cdr.detectChanges();
        //console.log(this.DataSource.paginator);
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.sort;
      }
    );
  }

  getcssclas() {
    this.ListSolCompReg.forEach((element) => {
      if (element.Statname == "S. P. NUEVA PETICION") {
        element.status = "newsc";
      } else if (
        element.Statname == "S. P. AUTORIZADO POR GERENTE" ||
        element.Statname == "S. P. AUTORIZADO POR DIRECCION" ||
        element.Statname == "S. P. PRESUPUESTO AUTORIZADO" ||
        element.Statname == "S. P. REVISADA POR COMPRAS"
      ) {
        element.status = "aut";
      } else if (
        element.Statname == "S. P. RECHAZADA POR GERENTE" ||
        element.Statname == "S. P. RECHAZADA POR DIRECCION" ||
        element.Statname == "S. P. PRESUPUESTO RECHAZADO" ||
        element.Statname == "S. P. RECHAZADA POR COMPRAS" ||
        element.Statname == "S. P. CANCELADA"
      ) {
        element.status = "rech";
      } else if (
        element.Statname == "S. P. CARGADA EN ARCHIVO Y ENVIADA A SAP"
      ) {
        element.status = "carsap";
      } else if (element.Statname == "CONTRATO MARCO") {
        element.status = "fin";
      }
    });
  }

  isPDF(data: SolicitudesCompraRegistradas) {
    //console.log("*/*/*/*/*/*/*/*/*/*/*/*/*/");
    //console.log(data.Statname);

    if (data.Statname === "S. C. Completa  Sistema SAP") {
      this.genPDF = true;
    } else {
      this.genPDF = false;
    }
  }

  EditSolicitud(data: SolicitudesCompraRegistradas) {
    console.log("Dentro de el metodo que permite editar la solicitud ");
    console.log(data);

    if (
      data.Statname === "S. P. RECHAZADA POR GERENTE" ||
      data.Statname === "S. P. RECHAZADA POR DIRECCION"
    ) {
      this.iseditsolped = true;
      this.iseditproductbutton = true;
      this.iseditchilds = true;
    } else {
      this.iseditproductbutton = false;
      this.iseditsolped = false;
      this.iseditchilds = false;
    }

    this.viewcoutn = false;
    this.isViewEditingSol = true;
    this.isviewChilds = false;

    console.log(data.Statname);

    if (
      data.Statname == "S. P. PRESUPUESTO AUTORIZADO" ||
      data.Statname == "S. P. PRESUPUESTO RECHAZADO"
    ) {
      this.isviewEdit = true;
    } else {
      this.isviewEdit = false;
    }

    this.DataSolReg = data;
    this.validacionTipoSOlicitud(this.DataSolReg);

    console.log("este es el id de EMpresa----" + this.DataSolReg.IdEmpresa);
    this.empresa = new Empresa();
    this.tiposol = new Imputacion();
    this.empresa.Bukrs = this.DataSolReg.IdEmpresa;
    this.tiposol.Acronimo = this.DataSolReg.Acronimo;
    this.plaza = new SucursalPlaza();
    this.plaza.IdPlaza = this.DataSolReg.IdPlaza;
    this.inielements();
    this.isload = true;
    this.solicitudComp.getDetalleSolicitud(data.ID).subscribe(
      (data) => {
        this.ListDetallesol = data;
      },
      (error) => {
        if (error.status == 403 || error.status == 404) {
          this.toast.setMessage(error.message, "danger");
          this.auth.logout();
        }
        console.log("error al traer el detalle de la solicitud");
      },
      () => {
        console.log("Esta es el detalle de los items");
        console.log(this.ListDetallesol);
        this.isload = false;
        this.ListDetallesol.forEach((element) => {
          if (data.IdSol == 4 || data.IdSol == 7) {
            element.butonMoreChilds = true;
          } else {
            element.butonMoreChilds = false;
          }
        });

        this.dataSource = new MatTableDataSource(this.ListDetallesol);

        this.dataSource.paginator = this.paginator;

        this.dataSource.sort = this.sort;
      }
    );
  }

  inielements() {
    this.getOrdenInterna();
    this.getAlmacen();
    this.getAllCentroCosto();
    this.getAllCuntaMayor();
    this.getAllGrupoCompra();
    this.GetAllOrdenEstadistica();
    this.getAllNecesidad();
  }

  cancelEditing() {
    this.viewcoutn = true;
    this.isViewEditingSol = false;
    this.isviewChilds = false;
    this.iseditproduct = false;
    this.iseditsolped = false;
    this.iseditproduct = false;
    this.toast.setMessage("item editing cancelled.", "warning");
    this.getAllSolicitudforUser();
  }

  EndEditingAndChangedStatus(){
    this.viewcoutn = true;
    this.isViewEditingSol = false;
    this.isviewChilds = false;
    this.iseditproduct = false;
    this.iseditsolped = false;
    this.iseditproduct = false;
    this.toast.setMessage("Los datos fueron actualizados correctamente y la solicitud cambios a un estatus S. P. NUEVA PETICION.", "success");
    this.getAllSolicitudforUser();
  }

  VieEditProductos(products) {
    console.log("-------*************--------");
    console.log(products);
    this.detalle_producto = products;
    console.log("-------*************--------");
    if (
      this.DataSolReg.Statname === "S. P. NUEVA PETICION" ||
      this.DataSolReg.Statname === "S. P. PRESUPUESTO RECHAZADO" ||
      this.DataSolReg.Statname === "S. P. RECHAZADA POR GERENTE" ||
      this.DataSolReg.Statname === "S. P. RECHAZADA POR DIRECCION" ||
      this.DataSolReg.Statname === "S. P. PRESUPUESTO RECHAZADO" ||
      this.DataSolReg.Statname === "S. P. RECHAZADA POR COMPRAS"
    ) {
      this.iseditproduct = true;
    }

    if (this.DataSolReg.IdSol == 5) {
      console.log("dentro de Orden intera IF");
      this.getunidadMedida(" ");
    } else {
      console.log("dentro de Orden Interna else");
      this.getunidadMedida(this.detalle_producto.IdMaterial);
    }

    this.getOrdenInterna();
    this.getAlmacen();
    this.getAllCentroCosto();
    this.getAllCuntaMayor();
    this.getAllGrupoCompra();
    this.GetAllOrdenEstadistica();
    this.getAllNecesidad();
    // console.log("Este es el Id del material "+this.detalle_producto.IdMaterial);
    // if(this.DataSolReg.IdSol != 5){
    //   // var Material: String = ' ';
    //   this.getunidadMedida(' ');

    // }else{
    //   this.getunidadMedida(this.detalle_producto.IdMaterial);
    // }
  }

  cancelEditProduct() {
    this.iseditproduct = false;
  }

  ViewChilds(SolPed: Detallesol) {
    console.log("Este es el ide del Item a consultar----");
    console.log(SolPed.IdProducto);

    this.getunidadMedida(" ");

    if ((this.viewChilds = true)) {
      this.viewChilds = false;
    } else {
      this.viewChilds = true;
    }

    this.solicitudComp.getDetalleSubItems(SolPed.IdProducto).subscribe(
      (data) => {
        console.log("---------------CHILDS-------------------");
        console.log(data);
        this.ListChilds = data;
        console.log(this.DatosSubProd);
        this.ListDetallesol.forEach((element) => {
          element.SubHijos = this.ListChilds;
          console.log("*/*/*/*/*/*/*");
          console.log(element);
          this.dataChilds = new MatTableDataSource(element.SubHijos);

          if (SolPed.IdProducto == element.IdProducto) {
            element.isOpen = true;
            this.viewChilds = true;
          } else {
            element.isOpen = false;
            this.viewChilds = false;
          }
        });
      },
      (error) => {
        if (error.status == 403 || error.status == 404) {
          this.toast.setMessage(error.message, "danger");
          this.auth.logout();
        }
        console.log("error al recuperar la informacion de los Hijos");
        console.log(error);
      },
      () => {
        //console.log("pasamos los datos a la nueva lsita para msotrarla en la lista");
        // this.dataChilds = new MatTableDataSource(this.ListChilds);
      }
    );
  }

  closeViewChilds(){
    this.viewChilds = false;
  }

  viewEditSubProducts(childs) {
    console.log(childs);
    this.detalle_subproducts = childs;
    this.iseditsubProduct = true;
    this.GetAllOrdenEstadistica();
    this.getAllCentroCosto();
    this.getAllCuntaMayor();
  }

  canceleditSubProduct() {
    this.iseditsubProduct = false;
  }

  getOrdenInterna() {
    console.log(
      "este es el Acronimo del Tipo de SOlicitud ---" + this.DataSolReg.Acronimo
    );
    console.log("este es el id de EMpresa----" + this.DataSolReg.IdEmpresa);
    this.empresa = new Empresa();
    this.tiposol = new Imputacion();
    this.empresa.Bukrs = this.DataSolReg.IdEmpresa;
    this.tiposol.Acronimo = this.DataSolReg.Acronimo;
    // console.log("---E---"+this.empresa);
    // console.log("----I.----"+this.tiposol);
    this.isload = true;
    this.ListOrdenInterna = this.solicitudComp.getAllOrdenInterna(
      this.empresa,
      this.tiposol
    );
    this.isload = false;
  }

  selectedOInterna() {
    console.log(this.SelectedOInvercion);
  }

  getAlmacen() {
    console.log(
      "Recuperamos los almacenes con este Id de Plaza-->" +
        this.DataSolReg.IdPlaza
    );

    this.ListAlmacen = this.solicitudComp.getAllAlmacen(this.plaza);
    this.AlmacenCrtl.setValue(this.ListAlmacen[0]);
    this.filteredAlmacen.next(this.ListAlmacen);
    this.AlmacenFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAlmacen();
      });
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

  getAllMateriales() {
    console.log(
      "Est es el id de la plaza para realizar las consultas----->" +
        this.plaza.IdPlaza
    );
    console.log(
      "Este es el Id del almacen seleccionado--->" + this.SelectedAlmacen
    );
    this.ListMateriales = this.solicitudComp.getAllmateriales(
      this.plaza,
      this.SelectedAlmacen
    );
    this.MaterialesCtrl.setValue(this.ListMateriales[0]);
    this.filteredMaterial.next(this.ListMateriales);
    this.MaterialesFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterMaterial();
      });
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

  getAllCentroCosto() {
    console.log(
      "Centro de Costos--->>" +
        this.empresa.Bukrs +
        "     " +
        this.plaza.IdPlaza
    );
    this.ListCCostos = this.solicitudComp.getCentoCosto(
      this.empresa,
      this.plaza
    );
    this.CCostosCrtl.setValue(this.ListCCostos[0]);
    this.filteredCCostos.next(this.ListCCostos);

    this.CCosotosFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCCosotos();
      });
  }

  filterCCosotos() {
    if (!this.CCosotosFilterCtrl) {
      return;
    }
    //obtenemos la palabra clave buscar
    let search = this.CCosotosFilterCtrl.value;
    console.log(search);
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

  getAllCuntaMayor() {
    console.log(
      "Dentro del metodo que regresa las cuentas de mayor--->" +
        this.empresa.Bukrs
    );

    if (this.DataSolReg.IdTipoSolicitud == 2) {
      this.ListCmayor = this.solicitudComp.getCuentaMayor(
        this.empresa,
        this.DataSolReg.Acronimo
      );
      this.CMayorCtrl.setValue(this.ListCmayor[0]);
      this.filteredCMayor.next(this.ListCmayor);
      this.CMayorFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterCmayor();
        });
    } else {
      this.ListCmayor = this.solicitudComp.getCuentaMayor(this.empresa, " ");
      this.CMayorCtrl.setValue(this.ListCmayor[0]);
      this.filteredCMayor.next(this.ListCmayor);
      this.CMayorFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterCmayor();
        });
    }
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

  getAllGrupoCompra() {
    console.log(
      "Este es el Id de la empresa para recuperar los grupos de compras    " +
        this.empresa
    );
    this.ListGrupoCompra = this.solicitudComp.getAllGrupoCompra(this.empresa);
    this.GCompraCtrl.setValue(this.ListGrupoCompra[0]);
    this.filteredGCompra.next(this.ListGrupoCompra);
    this.GCompraFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterGrupoCompra();
      });
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

  getunidadMedida(Material: string) {
    // console.log("Id de el Material ---> " + this.SelectedMaterial.IdMaterial);
    this.ListUnidadMedida = this.solicitudComp.GetAllUnidadMedida(Material);
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

  GetAllOrdenEstadistica() {
    console.log(
      "Recuperando informacion de Orden estadisitica -->" + this.empresa.Bukrs,
      this.DataSolReg.Acronimo
    );
    this.tiposol.Acronimo = this.DataSolReg.Acronimo;
    this.ListOrdEstadistica = this.solicitudComp.getAllOrdenInterna(
      this.empresa,
      this.tiposol
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

  getAllNecesidad() {
    //console.log("-----------------------------*/*/*/*/*/*/*/*/*/*/*/---------------------------------------------");
    this.solicitudComp.getAllNecesidad().subscribe(
      (data) => (this.ListNecesidad = data),
      (error) => {
        if (error.status == 403 || error.status == 404) {
          this.toast.setMessage(error.message, "danger");
          this.auth.logout();
        }
        console.log(error);
      }
    );
  }

  validacionTipoSOlicitud(Data: SolicitudesCompraRegistradas) {
    console.log("+++++++++++++++++++++++++++++++++++++");
    console.log(Data.IdSol);
    if (Data.IdSol === 1) {
      console.log("COMPRAS DE ACTIVOS FIJOS");
      this.isCantidad = false;
      this.isPrecio = false;
      this.AplicaOrdInt = true;
      this.AplicaCenCost = true;
      this.AplicaCtaMayor = true;
      this.isOrdEstadistica = true;
      this.AplicaMat = true;
      this.AplicaAlma = true;
      //this.AplicaCentro = false;
      this.AplicaNumActivo = false;
      //vaciando los Selects de Almacen y Materiales.
      // this.ListAlmacen = undefined;
      // this.ListMateriales = undefined;
      this.AplicaUsobien = false;
      // this.isAddHijos = false;
      // this.isbloqued = false;
      this.AplicaUMedida = false;
    } else if (Data.IdSol === 2) {
      console.log("SITIOS DE TRANSMISION");
      this.isCantidad = false;
      this.isPrecio = false;
      this.AplicaOrdInt = false;
      this.isOrdEstadistica = true;
      this.AplicaCenCost = true;
      this.AplicaCtaMayor = false;
      this.AplicaMat = true;
      this.AplicaAlma = true;
      this.AplicaNumActivo = true;
      // this.ListMateriales = undefined;
      this.AplicaUsobien = false;
      // this.isAddHijos = false;
      // this.isbloqued = false;
      this.AplicaUMedida = false;
    } else if (Data.IdSol === 3) {
      console.log("COMPRAS EN GENERAL");
      this.isCantidad = false;
      this.isPrecio = false;
      this.AplicaOrdInt = true;
      this.isOrdEstadistica = true;
      this.AplicaCenCost = false;
      this.AplicaCtaMayor = false;
      this.AplicaMat = true;
      this.AplicaAlma = true;
      //this.AplicaCentro = false;
      this.AplicaNumActivo = true;
      //vaciando los Selects de Almacen y Materiales.
      // this.ListAlmacen = undefined;
      // this.ListMateriales = undefined;
      this.AplicaUsobien = false;
      // this.isAddHijos = false;
      // this.isbloqued = false;
      this.AplicaUMedida = false;
    } else if (Data.IdSol === 4) {
      console.log("SERVICIOS");
      this.isCantidad = true;
      this.isPrecio = true;
      this.AplicaOrdInt = true;
      this.isOrdEstadistica = true;
      this.isOrdenEstadisticaChild = true;
      this.AplicaCenCost = true;
      this.AplicaCtaMayor = true;
      this.AplicaMat = true;
      this.AplicaAlma = true;
      this.AplicaNumActivo = true;
      this.ListAlmacen = undefined;
      this.ListMateriales = undefined;
      this.AplicaUsobien = false;
      // this.isAddHijos = true;
      // this.disabledforchild = true;
      //bloqueamos campos de Cantidad y Precio para el tipo de Sol 4
      // this.isbloqued = true;
      this.AplicaUMedida = true;
    } else if (Data.IdSol === 5) {
      console.log("COMPRAS DE ARTICULOS INVENTARIADOS");
      this.isCantidad = false;
      this.isPrecio = false;
      this.AplicaOrdInt = true;
      this.isOrdEstadistica = true;
      this.AplicaCenCost = true;
      this.AplicaCtaMayor = true;
      this.AplicaMat = false;
      this.AplicaAlma = false;
      //this.AplicaCentro = false;
      this.AplicaNumActivo = true;
      this.AplicaUsobien = true;
      // this.isAddHijos = false;
      // this.isbloqued = false;
      // this.AplicaUMedida = false;
    } else if (Data.IdSol === 6) {
      console.log("PRODUCCIONES");
      this.isCantidad = false;
      this.isPrecio = false;
      this.AplicaOrdInt = true;
      this.isOrdEstadistica = false;
      this.AplicaCenCost = false;
      this.AplicaCtaMayor = false;
      this.AplicaMat = true;
      this.AplicaAlma = true;
      this.AplicaNumActivo = true;
      this.filteredMaterial = undefined;
      this.AplicaUsobien = false;
      this.AplicaUMedida = false;
    } else if (Data.IdSol === 7) {
      console.log("SERVICIOS CON PRODUCCIONES");
      this.isCantidad = true;
      this.isPrecio = true;
      this.AplicaOrdInt = true;
      this.isOrdEstadistica = true;
      this.isOrdenEstadisticaChild = false;
      this.AplicaCenCost = true;
      this.AplicaCtaMayor = true;
      this.AplicaMat = true;
      this.AplicaAlma = true;
      this.AplicaNumActivo = true;
      this.ListAlmacen = undefined;
      this.ListMateriales = undefined;
      this.AplicaUsobien = false;
      this.AplicaUMedida = true;
    }
  }

 

  async updateLVLSOlcitud() {
    if (
      this.requirente == undefined &&
      this.puesto == undefined &&
      this.email == undefined &&
      this.tel == undefined &&
      this.ext == undefined &&
      this.produccion == undefined &&
      this.justificacion == undefined &&
      this.SelectedOInvercion.IdOrdenInterna == undefined &&
      this.SelectedOInvercion.NombreOrder == undefined
    ) {
      this.toast.setMessage(
        "si se requiere actualizar, debe de existir por lo menos un dato que actualizar",
        "warning"
      );
    } else {
      if (
        this.requirente == undefined ||
        this.requirente == null ||
        this.requirente == ""
      ) {
        this.requirente = this.DataSolReg.REQUIRENTE;
      }
      if (
        this.puesto == undefined ||
        this.puesto == null ||
        this.puesto == ""
      ) {
        this.puesto = this.DataSolReg.Puesto;
      }
      if (this.email == undefined || this.email == null || this.email == "") {
        this.email = this.DataSolReg.Email;
      }
      if (this.tel == undefined || this.tel == null || this.tel == "") {
        this.tel = this.DataSolReg.Tel;
      }
      if (this.ext == undefined || this.ext == null || this.ext == "") {
        this.ext = this.DataSolReg.Ext;
      }
      if (
        this.produccion == undefined ||
        this.produccion == null ||
        this.produccion == ""
      ) {
        this.produccion = this.DataSolReg.Produccion;
      }
      if (
        this.justificacion == undefined ||
        this.justificacion == null ||
        this.justificacion == ""
      ) {
        console.log("Dentro de la validacion e Justificacion");
        this.justificacion = this.DataSolReg.Justificacion;
      }

      if (
        this.SelectedOInvercion.IdOrdenInterna.length === 0 &&
        this.SelectedOInvercion.NombreOrder.length === 0 ||
        this.DataSolReg.IdOrdenInterna == null &&
        this.DataSolReg.OInterna == null
      ) {
        console.log(
          "dentro del metodo que valida que todos los valores son nulls"
        );
        this.SelectedOInvercion.IdOrdenInterna = "";
        this.SelectedOInvercion.NombreOrder = "";
      }
      console.log(
        "este es el else se quedara el estatus de la solicitud hasta que se termine de actualizar los datos de toda la solicitud"
      );

      this.solicitudComp
        .updateinfoSol(
          this.DataSolReg.ID,
          this.requirente,
          this.puesto,
          this.email,
          this.tel,
          this.ext,
          this.produccion,
          this.justificacion,
          this.SelectedOInvercion.IdOrdenInterna,
          this.SelectedOInvercion.NombreOrder,
          this.newStatus
        )
        .subscribe(
          (data) => {
            console.log(data);
            this.openedDataSol = false;
            this.requirente = "";
            this.puesto = "";
            this.email = "";
            this.tel = "";
            this.ext = "";
            this.produccion = "";
            this.justificacion = "";
            this.SelectedOInvercion.IdOrdenInterna = "";
            this.SelectedOInvercion.NombreOrder = "";
            this.toast.setMessage('Puedes seguir editando',"success");
          },
          (error) => {
            if (error.status == 403 || error.status == 404) {
              this.toast.setMessage(error.message, "danger");
              this.auth.logout();
            }
            console.log(error);
            //this.ngOnInit();
            this.getOrdenInterna();
            this.requirente = "";
            this.puesto = "";
            this.email = "";
            this.tel = "";
            this.ext = "";
            this.produccion = "";
            this.justificacion = "";
            this.SelectedOInvercion.IdOrdenInterna = "";
            this.SelectedOInvercion.NombreOrder = "";
            this.toast.setMessage("Error desde el componente", "warning");
          }
        );
    }
  }

  UpdateLVLProducts() {
    if (this.DataSolReg.IdSol === 1) {
      console.log("COMPRAS DE ACTIVOS FIJOS");
      if (
        this.precio == undefined ||
        (this.precio == 0 && this.cantidad == undefined) ||
        (this.cantidad == 0 &&
          this.Espesificaciones == undefined &&
          this.UsoBien == undefined &&
          // this.SelectedAlmacen.IdAlmacen === undefined || this.SelectedAlmacen.IdAlmacen === '' &&
          // this.SelectedAlmacen.Nombre === undefined || this.SelectedAlmacen.Nombre === '' &&
          // this.SelectedMaterial.IdMaterial === undefined || this.SelectedMaterial.IdMaterial === '' &&
          // this.SelectedMaterial.Nombre === undefined || this.SelectedMaterial.Nombre === '' &&
          // this.SelectedCentroCost.IdCentroCosto === undefined || this.SelectedCentroCost.IdCentroCosto === '' &&
          // this.SelectedCentroCost.Nombre === undefined || this.SelectedCentroCost.Nombre === '' &&
          // this.SelectedCuentaMayor.IdCuentaMayor === undefined || this.SelectedCuentaMayor.IdCuentaMayor === '' &&
          // this.SelectedCuentaMayor.Nombre === undefined || this.SelectedCuentaMayor.Nombre === '' &&
          this.SelectedGrupoComp.IdGrupoCompra === undefined &&
          this.SelectedGrupoComp.Nombre === undefined &&
          this.SelectedUnidadMed.IdUnidadMedida === undefined &&
          this.SelectedUnidadMed.NombreUnidadMedida === undefined &&
          // this.SelectOrdenEstadisitica.IdOrdenInterna === undefined || this.SelectOrdenEstadisitica.IdOrdenInterna === '' &&
          // this.SelectOrdenEstadisitica.NombreOrder === undefined || this.SelectOrdenEstadisitica.NombreOrder === '' &&
          this.SelectedNumActivo.IdActivo === undefined &&
          this.SelectedNumActivo.Nombre === undefined &&
          this.SelectedNecesidad.IdNecesidad === undefined &&
          this.SelectedNecesidad.Nombre === undefined)
      ) {
        this.toast.setMessage(
          "si se requiere actualizar un producto, se debe de llenar almenos un campo o seleccionar una opcion",
          "warning"
        );
      } else {
        if (this.precio == undefined || this.precio == 0) {
          this.precio = this.detalle_producto.Precio;
          //this.priceS = this.detalle_producto.PRECIO.toString();
        }
        if (this.cantidad == undefined || this.cantidad == 0) {
          this.cantidad = this.detalle_producto.CANTIDAD;
        }
        if (this.Espesificaciones == undefined || this.Espesificaciones == "") {
          this.Espesificaciones = this.detalle_producto.EspGenerales;
        }
        if (this.UsoBien == undefined || this.UsoBien == "") {
          this.UsoBien = this.detalle_producto.BIENOSERV;
        }
        if (
          (this.SelectedAlmacen === undefined &&
            this.detalle_producto.IdAlmacen === undefined) ||
          (this.detalle_producto.IdAlmacen === null &&
            this.detalle_producto.AlmacenName === undefined) ||
          this.detalle_producto.AlmacenName === null
        ) {
          this.SelectedAlmacen.IdAlmacen = " ";
          this.SelectedAlmacen.Nombre = " ";
        } else {
          this.SelectedAlmacen.IdAlmacen = this.detalle_producto.IdAlmacen;
          this.SelectedAlmacen.Nombre = this.detalle_producto.AlmacenName;
        }

        if (
          (this.SelectedMaterial === undefined &&
            this.detalle_producto.IdMaterial === undefined) ||
          (this.detalle_producto.IdMaterial === null &&
            this.detalle_producto.MaterialName === undefined) ||
          this.detalle_producto.MaterialName === null
        ) {
          this.SelectedMaterial.IdMaterial = " ";
          this.SelectedMaterial.Nombre = " ";
        } else {
          this.SelectedMaterial.IdMaterial = this.detalle_producto.IdMaterial;
          this.SelectedMaterial.Nombre = this.detalle_producto.MaterialName;
        }

        if (
          this.SelectedCentroCost.IdCentroCosto.length === 0 &&
          this.SelectedCentroCost.Nombre.length === 0 &&
          this.detalle_producto.IdCentroCostos.length === 0 &&
          this.detalle_producto.CECO.length === 0
        ) {
          console.log("dentro del if");
          this.SelectedCentroCost.IdCentroCosto = " ";
          this.SelectedCentroCost.Nombre = " ";
        } else if (
          this.SelectedCentroCost.IdCentroCosto.length === 0 &&
          this.SelectedCentroCost.Nombre.length === 0 &&
          this.detalle_producto.IdCentroCostos.length != 0 &&
          this.detalle_producto.CECO.length != 0
        ) {
          console.log("dentro del else if");
          this.SelectedCentroCost.IdCentroCosto =
            this.detalle_producto.IdCentroCostos;
          this.SelectedCentroCost.Nombre = this.detalle_producto.CECO;
        } else {
          console.log("se tomaran los valores del select");
        }
        if (
          this.SelectedCuentaMayor.IdCuentaMayor.length === 0 &&
          this.SelectedCuentaMayor.Nombre.length === 0 &&
          this.detalle_producto.IdCuentaMayor.length === 0 &&
          this.detalle_producto.CMAYOR.length === 0
        ) {
          this.SelectedCuentaMayor.IdCuentaMayor = " ";
          this.SelectedCuentaMayor.Nombre = " ";
        } else if (
          this.SelectedCuentaMayor.IdCuentaMayor.length === 0 &&
          this.SelectedCuentaMayor.Nombre.length === 0 &&
          this.detalle_producto.IdCuentaMayor.length != 0 &&
          this.detalle_producto.CMAYOR.length != 0
        ) {
          this.SelectedCuentaMayor.IdCuentaMayor =
            this.detalle_producto.IdCuentaMayor;
          this.SelectedCuentaMayor.Nombre = this.detalle_producto.CMAYOR;
        }
        console.log("GRUPO DE COMRPA" + this.SelectedGrupoComp);
        console.log(this.detalle_producto.IdGrupoCompra);
        console.log(this.detalle_producto.GrupoCompraName);
        if (
          this.SelectedGrupoComp.IdGrupoCompra === undefined &&
          this.SelectedGrupoComp.Nombre === undefined &&
          this.detalle_producto.IdGrupoCompra.length === 0 &&
          this.detalle_producto.GrupoCompraName.length === 0
        ) {
          console.log("datos dentro del if de grupos de compra");
          this.SelectedGrupoComp.IdGrupoCompra = 0;
          this.SelectedGrupoComp.Nombre = " ";
        } else if (
          this.SelectedGrupoComp.IdGrupoCompra === undefined &&
          this.SelectedGrupoComp.Nombre === undefined &&
          this.detalle_producto.IdGrupoCompra.length != 0 &&
          this.detalle_producto.GrupoCompraName.length != 0
        ) {
          console.log("dentro del else de griupo de compra");
          this.SelectedGrupoComp.IdGrupoCompra =
            this.detalle_producto.IdGrupoCompra;
          this.SelectedGrupoComp.Nombre = this.detalle_producto.GrupoCompraName;
        }

        if (
          this.SelectedUnidadMed.IdUnidadMedida === undefined &&
          this.SelectedUnidadMed.NombreUnidadMedida === undefined &&
          this.detalle_producto.IdUnidadMedida.length === 0 &&
          this.detalle_producto.MEDIDA.length === 0
        ) {
          this.SelectedUnidadMed.IdUnidadMedida = " ";
          this.SelectedUnidadMed.NombreUnidadMedida = " ";
        } else if (
          this.SelectedUnidadMed.IdUnidadMedida === undefined &&
          this.SelectedUnidadMed.NombreUnidadMedida === undefined &&
          this.detalle_producto.IdUnidadMedida.length != 0 &&
          this.detalle_producto.MEDIDA.length != 0
        ) {
          this.SelectedUnidadMed.IdUnidadMedida =
            this.detalle_producto.IdUnidadMedida;
          this.SelectedUnidadMed.NombreUnidadMedida =
            this.detalle_producto.MEDIDA;
        }
        if (
          this.SelectOrdenEstadisitica.IdOrdenInterna.length === 0 &&
          this.SelectOrdenEstadisitica.NombreOrder.length === 0 &&
          this.detalle_producto.IdOrdenEstadisitica === undefined &&
          this.detalle_producto.OrdenEstadisiticaName === undefined
        ) {
          console.log("datos de orden internaaaaa-----");
          this.SelectOrdenEstadisitica.IdOrdenInterna = " ";
          this.SelectOrdenEstadisitica.NombreOrder = " ";
        } else if (
          this.SelectOrdenEstadisitica.IdOrdenInterna.length === 0 &&
          this.SelectOrdenEstadisitica.NombreOrder.length === 0 &&
          this.detalle_producto.IdOrdenEstadisitica.length != 0 &&
          this.detalle_producto.OrdenEstadisiticaName.length != 0
        ) {
          console.log("datos de orden estadistica 2 ------------");
          this.SelectOrdenEstadisitica.IdOrdenInterna =
            this.detalle_producto.IdOrdenEstadisitica;
          this.SelectOrdenEstadisitica.NombreOrder =
            this.detalle_producto.OrdenEstadisiticaName;
        }
        if (
          this.SelectedNumActivo.IdActivo === undefined &&
          this.SelectedNumActivo.IdActivo === undefined &&
          this.detalle_producto.IdNumeroActivo.length === 0 &&
          this.detalle_producto.ACTFIJ.length === 0
        ) {
          this.SelectedNumActivo.IdActivo = " ";
          this.SelectedNumActivo.Nombre = " ";
        } else if (
          this.SelectedNumActivo.IdActivo === undefined &&
          this.SelectedNumActivo.IdActivo === undefined &&
          this.detalle_producto.IdNumeroActivo.length != 0 &&
          this.detalle_producto.ACTFIJ.length != 0
        ) {
          this.SelectedNumActivo.IdActivo =
            this.detalle_producto.IdNumeroActivo;
          this.SelectedNumActivo.Nombre = this.detalle_producto.ACTFIJ;
        }
        if (
          this.SelectedNecesidad.IdNecesidad === undefined &&
          this.SelectedNecesidad.Nombre === undefined &&
          this.detalle_producto.IdNecesidad.length === 0 &&
          this.detalle_producto.NumeroNecesidadName.length === 0
        ) {
          this.SelectedNecesidad.IdNecesidad = 0;
          this.SelectedNecesidad.Nombre = " ";
        } else if (
          this.SelectedNecesidad.IdNecesidad === undefined &&
          this.SelectedNecesidad.Nombre === undefined &&
          this.detalle_producto.IdNecesidad.length != 0 &&
          this.detalle_producto.NumeroNecesidadName.length != 0
        ) {
          this.SelectedNecesidad.IdNecesidad =
            this.detalle_producto.IdNecesidad;
          this.SelectedNecesidad.Nombre =
            this.detalle_producto.NumeroNecesidadName;
        }
        //console.log("-------//////  STATUS id" + this.DataSolReg.IdStatusSolicitud);
        var IdSol = this.DataSolReg.ID;
        //realizamos el update de los campos que se requeran, si no tiene ningun valor se llena con el que ya se tien en DB
        this.solicitudComp
          .updateinfoProd(
            IdSol,
            this.detalle_producto.IdProducto,
            this.precio,
            this.cantidad,
            this.SelectedAlmacen.IdAlmacen,
            this.SelectedAlmacen.Nombre,
            this.SelectedMaterial.IdMaterial,
            this.SelectedMaterial.Nombre,
            this.SelectedCentroCost.IdCentroCosto,
            this.SelectedCentroCost.Nombre,
            this.SelectedCuentaMayor.IdCuentaMayor,
            this.SelectedCuentaMayor.Nombre,
            this.SelectedGrupoComp.IdGrupoCompra,
            this.SelectedGrupoComp.Nombre,
            this.SelectedUnidadMed.IdUnidadMedida,
            this.SelectedUnidadMed.NombreUnidadMedida,
            this.SelectOrdenEstadisitica.IdOrdenInterna,
            this.SelectOrdenEstadisitica.NombreOrder,
            this.SelectedNumActivo.IdActivo,
            this.SelectedNumActivo.Nombre,
            this.SelectedNecesidad.IdNecesidad,
            this.SelectedNecesidad.Nombre,
            this.Espesificaciones,
            this.UsoBien,
            this.newStatus
          )
          .subscribe(
            (data) => {
              console.log(data);
              this.precio = 0;
              this.cantidad = 0;
              this.SelectedAlmacen = new Almacen();
              this.SelectedMaterial = new Materiales();
              this.SelectedCentroCost = new CentroCostos();
              this.SelectedCuentaMayor = new CuentaMayor();
              this.SelectedGrupoComp = new GrupoCompra();
              this.SelectedUnidadMed = new UnidadMedida();
              this.SelectOrdenEstadisitica = new OrdenInterna();
              this.SelectedNumActivo = new Activo();
              this.SelectedNecesidad = new Necesidad();
              this.Espesificaciones = "";
              this.UsoBien = "";
              this.toast.setMessage(
                "Puedes seguir editndo",
                "success"
              );
              //this.cancelEditing();
            },
            (error) => {
              console.log(error);
              if (error.status == 403 || error.status == 404) {
                this.toast.setMessage(error.message, "danger");
                this.auth.logout();
              }
              this.precio = 0;
              this.cantidad = 0;
              this.SelectedAlmacen = new Almacen();
              this.SelectedMaterial = new Materiales();
              this.SelectedCentroCost = new CentroCostos();
              this.SelectedCuentaMayor = new CuentaMayor();
              this.SelectedGrupoComp = new GrupoCompra();
              this.SelectedUnidadMed = new UnidadMedida();
              this.SelectOrdenEstadisitica = new OrdenInterna();
              this.SelectedNumActivo = new Activo();
              this.SelectedNecesidad = new Necesidad();
              this.Espesificaciones = "";
              this.UsoBien = "";
              this.toast.setMessage(
                "Error al actualizar el Concepto--" + error,
                "danger"
              );
            }
          );
      }
    } else if (this.DataSolReg.IdSol === 2) {
      console.log("SITIOS DE TRANSMISION");
      if (
        this.precio == undefined ||
        (this.precio == 0 && this.cantidad == undefined) ||
        (this.cantidad == 0 &&
          this.Espesificaciones == undefined &&
          this.UsoBien == undefined &&
          // this.SelectedAlmacen.IdAlmacen === undefined || this.SelectedAlmacen.IdAlmacen === '' &&
          // this.SelectedAlmacen.Nombre === undefined || this.SelectedAlmacen.Nombre === '' &&
          // this.SelectedMaterial.IdMaterial === undefined || this.SelectedMaterial.IdMaterial === '' &&
          // this.SelectedMaterial.Nombre === undefined || this.SelectedMaterial.Nombre === '' &&
          // this.SelectedCentroCost.IdCentroCosto === undefined || this.SelectedCentroCost.IdCentroCosto === '' &&
          // this.SelectedCentroCost.Nombre === undefined || this.SelectedCentroCost.Nombre === '' &&
          this.SelectedCuentaMayor.IdCuentaMayor === undefined &&
          this.SelectedCuentaMayor.Nombre === undefined &&
          this.SelectedGrupoComp.IdGrupoCompra === undefined &&
          this.SelectedGrupoComp.Nombre === undefined &&
          this.SelectedUnidadMed.IdUnidadMedida === undefined &&
          this.SelectedUnidadMed.NombreUnidadMedida === undefined &&
          // this.SelectOrdenEstadisitica.IdOrdenInterna === undefined || this.SelectOrdenEstadisitica.IdOrdenInterna === '' &&
          // this.SelectOrdenEstadisitica.NombreOrder === undefined || this.SelectOrdenEstadisitica.NombreOrder === '' &&
          // this.SelectedNumActivo.IdActivo === undefined || this.SelectedNumActivo.IdActivo === '' &&
          // this.SelectedNumActivo.Nombre === undefined || this.SelectedNumActivo.Nombre === '' &&
          this.SelectedNecesidad.IdNecesidad === undefined &&
          this.SelectedNecesidad.Nombre === undefined)
      ) {
        this.toast.setMessage(
          "si se requiere actualizar un producto, se debe de llenar almenos un campo o seleccionar una opcion",
          "warning"
        );
      } else {
        if (this.precio == undefined || this.precio == 0) {
          this.precio = this.detalle_producto.Precio;
          //this.priceS = this.detalle_producto.PRECIO.toString();
        }
        if (this.cantidad == undefined || this.cantidad == 0) {
          this.cantidad = this.detalle_producto.CANTIDAD;
        }
        if (this.Espesificaciones == undefined || this.Espesificaciones == "") {
          this.Espesificaciones = this.detalle_producto.EspGenerales;
        }
        if (this.UsoBien == undefined || this.UsoBien == "") {
          this.UsoBien = this.detalle_producto.BIENOSERV;
        }

        if (
          (this.SelectedAlmacen === undefined &&
            this.detalle_producto.IdAlmacen === undefined) ||
          (this.detalle_producto.IdAlmacen === null &&
            this.detalle_producto.AlmacenName === undefined) ||
          this.detalle_producto.AlmacenName === null
        ) {
          this.SelectedAlmacen.IdAlmacen = " ";
          this.SelectedAlmacen.Nombre = " ";
        } else {
          this.SelectedAlmacen.IdAlmacen = this.detalle_producto.IdAlmacen;
          this.SelectedAlmacen.Nombre = this.detalle_producto.AlmacenName;
        }

        if (
          (this.SelectedMaterial === undefined &&
            this.detalle_producto.IdMaterial === undefined) ||
          (this.detalle_producto.IdMaterial === null &&
            this.detalle_producto.MaterialName === undefined) ||
          this.detalle_producto.MaterialName === null
        ) {
          this.SelectedMaterial.IdMaterial = " ";
          this.SelectedMaterial.Nombre = " ";
        } else {
          this.SelectedMaterial.IdMaterial = this.detalle_producto.IdMaterial;
          this.SelectedMaterial.Nombre = this.detalle_producto.MaterialName;
        }

        if (
          this.SelectedCentroCost.IdCentroCosto.length === 0 &&
          this.SelectedCentroCost.Nombre.length === 0 &&
          this.detalle_producto.IdCentroCostos.length === 0 &&
          this.detalle_producto.CECO.length === 0
        ) {
          console.log("dentro del if");
          this.SelectedCentroCost.IdCentroCosto = " ";
          this.SelectedCentroCost.Nombre = " ";
        } else if (
          this.SelectedCentroCost.IdCentroCosto.length === 0 &&
          this.SelectedCentroCost.Nombre.length === 0 &&
          this.detalle_producto.IdCentroCostos.length != 0 &&
          this.detalle_producto.CECO.length != 0
        ) {
          console.log("dentro del else if");
          this.SelectedCentroCost.IdCentroCosto =
            this.detalle_producto.IdCentroCostos;
          this.SelectedCentroCost.Nombre = this.detalle_producto.CECO;
        } else {
          console.log("se tomaran los valores del select");
        }
        if (
          this.SelectedCuentaMayor.IdCuentaMayor.length === 0 &&
          this.SelectedCuentaMayor.Nombre.length === 0 &&
          this.detalle_producto.IdCuentaMayor.length === 0 &&
          this.detalle_producto.CMAYOR.length === 0
        ) {
          this.SelectedCuentaMayor.IdCuentaMayor = " ";
          this.SelectedCuentaMayor.Nombre = " ";
        } else if (
          this.SelectedCuentaMayor.IdCuentaMayor.length === 0 &&
          this.SelectedCuentaMayor.Nombre.length === 0 &&
          this.detalle_producto.IdCuentaMayor.length != 0 &&
          this.detalle_producto.CMAYOR.length != 0
        ) {
          this.SelectedCuentaMayor.IdCuentaMayor =
            this.detalle_producto.IdCuentaMayor;
          this.SelectedCuentaMayor.Nombre = this.detalle_producto.CMAYOR;
        }
        console.log("GRUPO DE COMRPA" + this.SelectedGrupoComp);
        console.log(this.detalle_producto.IdGrupoCompra);
        console.log(this.detalle_producto.GrupoCompraName);
        if (
          this.SelectedGrupoComp.IdGrupoCompra === undefined &&
          this.SelectedGrupoComp.Nombre === undefined &&
          this.detalle_producto.IdGrupoCompra.length === 0 &&
          this.detalle_producto.GrupoCompraName.length === 0
        ) {
          console.log("datos dentro del if de grupos de compra");
          this.SelectedGrupoComp.IdGrupoCompra = 0;
          this.SelectedGrupoComp.Nombre = " ";
        } else if (
          this.SelectedGrupoComp.IdGrupoCompra === undefined &&
          this.SelectedGrupoComp.Nombre === undefined &&
          this.detalle_producto.IdGrupoCompra.length != 0 &&
          this.detalle_producto.GrupoCompraName.length != 0
        ) {
          console.log("dentro del else de griupo de compra");
          this.SelectedGrupoComp.IdGrupoCompra =
            this.detalle_producto.IdGrupoCompra;
          this.SelectedGrupoComp.Nombre = this.detalle_producto.GrupoCompraName;
        }

        if (
          this.SelectedUnidadMed.IdUnidadMedida === undefined &&
          this.SelectedUnidadMed.NombreUnidadMedida === undefined &&
          this.detalle_producto.IdUnidadMedida.length === 0 &&
          this.detalle_producto.MEDIDA.length === 0
        ) {
          this.SelectedUnidadMed.IdUnidadMedida = " ";
          this.SelectedUnidadMed.NombreUnidadMedida = " ";
        } else if (
          this.SelectedUnidadMed.IdUnidadMedida === undefined &&
          this.SelectedUnidadMed.NombreUnidadMedida === undefined &&
          this.detalle_producto.IdUnidadMedida.length != 0 &&
          this.detalle_producto.MEDIDA.length != 0
        ) {
          this.SelectedUnidadMed.IdUnidadMedida =
            this.detalle_producto.IdUnidadMedida;
          this.SelectedUnidadMed.NombreUnidadMedida =
            this.detalle_producto.MEDIDA;
        }
        if (
          this.SelectOrdenEstadisitica.IdOrdenInterna.length === 0 &&
          this.SelectOrdenEstadisitica.NombreOrder.length === 0 &&
          this.detalle_producto.IdOrdenEstadisitica === undefined &&
          this.detalle_producto.OrdenEstadisiticaName === undefined
        ) {
          console.log("datos de orden internaaaaa-----");
          this.SelectOrdenEstadisitica.IdOrdenInterna = " ";
          this.SelectOrdenEstadisitica.NombreOrder = " ";
        } else if (
          this.SelectOrdenEstadisitica.IdOrdenInterna.length === 0 &&
          this.SelectOrdenEstadisitica.NombreOrder.length === 0 &&
          this.detalle_producto.IdOrdenEstadisitica.length != 0 &&
          this.detalle_producto.OrdenEstadisiticaName.length != 0
        ) {
          console.log("datos de orden estadistica 2 ------------");
          this.SelectOrdenEstadisitica.IdOrdenInterna =
            this.detalle_producto.IdOrdenEstadisitica;
          this.SelectOrdenEstadisitica.NombreOrder =
            this.detalle_producto.OrdenEstadisiticaName;
        }
        if (
          this.SelectedNumActivo.IdActivo === undefined &&
          this.SelectedNumActivo.IdActivo === undefined &&
          this.detalle_producto.IdNumeroActivo.length === 0 &&
          this.detalle_producto.ACTFIJ.length === 0
        ) {
          this.SelectedNumActivo.IdActivo = " ";
          this.SelectedNumActivo.Nombre = " ";
        } else if (
          this.SelectedNumActivo.IdActivo === undefined &&
          this.SelectedNumActivo.IdActivo === undefined &&
          this.detalle_producto.IdNumeroActivo.length != 0 &&
          this.detalle_producto.ACTFIJ.length != 0
        ) {
          this.SelectedNumActivo.IdActivo =
            this.detalle_producto.IdNumeroActivo;
          this.SelectedNumActivo.Nombre = this.detalle_producto.ACTFIJ;
        }
        if (
          this.SelectedNecesidad.IdNecesidad === undefined &&
          this.SelectedNecesidad.Nombre === undefined &&
          this.detalle_producto.IdNecesidad.length === 0 &&
          this.detalle_producto.NumeroNecesidadName.length === 0
        ) {
          this.SelectedNecesidad.IdNecesidad = 0;
          this.SelectedNecesidad.Nombre = " ";
        } else if (
          this.SelectedNecesidad.IdNecesidad === undefined &&
          this.SelectedNecesidad.Nombre === undefined &&
          this.detalle_producto.IdNecesidad.length != 0 &&
          this.detalle_producto.NumeroNecesidadName.length != 0
        ) {
          this.SelectedNecesidad.IdNecesidad =
            this.detalle_producto.IdNecesidad;
          this.SelectedNecesidad.Nombre =
            this.detalle_producto.NumeroNecesidadName;
        }

        console.log(
          this.precio +
            " -- " +
            this.cantidad +
            " --- " +
            this.Espesificaciones +
            " -- " +
            this.UsoBien +
            "  "
        );
        //  console.log(this.SelectedAlmacen);
        //  console.log(this.SelectedMaterial);
        //  console.log(this.SelectedCentroCost);
        //  console.log(this.SelectedCuentaMayor);
        //  console.log(this.SelectedGrupoComp);
        //  console.log(this.SelectedUnidadMed);
        //  console.log(this.SelectOrdenEstadisitica);
        //  console.log(this.SelectedNumActivo);
        //  console.log(this.SelectedNecesidad);
        console.log(
          "-------//////  STATUS id" + this.DataSolReg.IdStatusSolicitud
        );
        var IdSol = this.DataSolReg.ID;
        //realizamos el update de los campos que se requeran, si no tiene ningun valor se llena con el que ya se tien en DB
        this.solicitudComp
          .updateinfoProd(
            IdSol,
            this.detalle_producto.IdProducto,
            this.precio,
            this.cantidad,
            this.SelectedAlmacen.IdAlmacen,
            this.SelectedAlmacen.Nombre,
            this.SelectedMaterial.IdMaterial,
            this.SelectedMaterial.Nombre,
            this.SelectedCentroCost.IdCentroCosto,
            this.SelectedCentroCost.Nombre,
            this.SelectedCuentaMayor.IdCuentaMayor,
            this.SelectedCuentaMayor.Nombre,
            this.SelectedGrupoComp.IdGrupoCompra,
            this.SelectedGrupoComp.Nombre,
            this.SelectedUnidadMed.IdUnidadMedida,
            this.SelectedUnidadMed.NombreUnidadMedida,
            this.SelectOrdenEstadisitica.IdOrdenInterna,
            this.SelectOrdenEstadisitica.NombreOrder,
            this.SelectedNumActivo.IdActivo,
            this.SelectedNumActivo.Nombre,
            this.SelectedNecesidad.IdNecesidad,
            this.SelectedNecesidad.Nombre,
            this.Espesificaciones,
            this.UsoBien,
            this.newStatus
          )
          .subscribe(
            (data) => {
              console.log(data);
              this.precio = 0;
              this.cantidad = 0;
              this.ngOnInit();
              this.SelectedAlmacen = new Almacen();
              this.SelectedMaterial = new Materiales();
              this.SelectedCentroCost = new CentroCostos();
              this.SelectedCuentaMayor = new CuentaMayor();
              this.SelectedGrupoComp = new GrupoCompra();
              this.SelectedUnidadMed = new UnidadMedida();
              this.SelectOrdenEstadisitica = new OrdenInterna();
              this.SelectedNumActivo = new Activo();
              this.SelectedNecesidad = new Necesidad();
              this.Espesificaciones = "";
              this.UsoBien = "";
              this.toast.setMessage(
                "Puedes seguir editando",
                "success"
              );
              //this.cancelEditing();
            },
            (err) => {
              console.log(err);
              this.precio = 0;
              this.cantidad = 0;
              this.ngOnInit();
              this.SelectedAlmacen = new Almacen();
              this.SelectedMaterial = new Materiales();
              this.SelectedCentroCost = new CentroCostos();
              this.SelectedCuentaMayor = new CuentaMayor();
              this.SelectedGrupoComp = new GrupoCompra();
              this.SelectedUnidadMed = new UnidadMedida();
              this.SelectOrdenEstadisitica = new OrdenInterna();
              this.SelectedNumActivo = new Activo();
              this.SelectedNecesidad = new Necesidad();
              this.Espesificaciones = "";
              this.UsoBien = "";
              this.toast.setMessage(
                "Error al actualizar el concepto--" + err,
                "danger"
              );
            }
          );
      }
    } else if (this.DataSolReg.IdSol === 3) {
      console.log("COMPRAS EN GENERAL");
      if (
          this.precio == undefined ||
          this.precio == 0 && 
          this.cantidad == undefined ||
          this.cantidad == 0 &&
          this.Espesificaciones == undefined &&
          this.UsoBien == undefined &&
          // this.SelectedAlmacen.IdAlmacen === undefined || this.SelectedAlmacen.IdAlmacen === '' &&
          // this.SelectedAlmacen.Nombre === undefined || this.SelectedAlmacen.Nombre === '' &&
          // this.SelectedMaterial.IdMaterial === undefined || this.SelectedMaterial.IdMaterial === '' &&
          // this.SelectedMaterial.Nombre === undefined || this.SelectedMaterial.Nombre === '' &&
          this.SelectedCentroCost.IdCentroCosto == undefined &&
          this.SelectedCentroCost.Nombre == undefined &&
          this.SelectedCuentaMayor.IdCuentaMayor == undefined &&
          this.SelectedCuentaMayor.Nombre == undefined &&
          this.SelectedGrupoComp.IdGrupoCompra == undefined &&
          this.SelectedGrupoComp.Nombre == undefined &&
          this.SelectedUnidadMed.IdUnidadMedida == undefined &&
          this.SelectedUnidadMed.NombreUnidadMedida == undefined &&
          // this.SelectOrdenEstadisitica.IdOrdenInterna === undefined || this.SelectOrdenEstadisitica.IdOrdenInterna === '' &&
          // this.SelectOrdenEstadisitica.NombreOrder === undefined || this.SelectOrdenEstadisitica.NombreOrder === '' &&
          // this.SelectedNumActivo.IdActivo === undefined || this.SelectedNumActivo.IdActivo === '' &&
          // this.SelectedNumActivo.Nombre === undefined || this.SelectedNumActivo.Nombre === '' &&
          this.SelectedNecesidad.IdNecesidad == undefined &&
          this.SelectedNecesidad.Nombre == undefined
      ) {
        this.toast.setMessage(
          "si se requiere actualizar un producto, se debe de llenar almenos un campo o seleccionar una opcion",
          "warning"
        );
      } else {
        if (this.precio == undefined || this.precio == 0) {
          this.precio = this.detalle_producto.Precio;
          //this.priceS = this.detalle_producto.PRECIO.toString();
        }
        if (this.cantidad == undefined || this.cantidad == 0) {
          this.cantidad = this.detalle_producto.CANTIDAD;
        }
        if (this.Espesificaciones == undefined || this.Espesificaciones == "") {
          this.Espesificaciones = this.detalle_producto.EspGenerales;
        }
        if (this.UsoBien == undefined || this.UsoBien == "") {
          this.UsoBien = this.detalle_producto.BIENOSERV;
        }
        if (
          (this.SelectedAlmacen === undefined &&
            this.detalle_producto.IdAlmacen === undefined) ||
          (this.detalle_producto.IdAlmacen === null &&
            this.detalle_producto.AlmacenName === undefined) ||
          this.detalle_producto.AlmacenName === null
        ) {
          this.SelectedAlmacen.IdAlmacen = " ";
          this.SelectedAlmacen.Nombre = " ";
        } else {
          this.SelectedAlmacen.IdAlmacen = this.detalle_producto.IdAlmacen;
          this.SelectedAlmacen.Nombre = this.detalle_producto.AlmacenName;
        }

        if (
          (this.SelectedMaterial === undefined &&
            this.detalle_producto.IdMaterial === undefined) ||
          (this.detalle_producto.IdMaterial === null &&
            this.detalle_producto.MaterialName === undefined) ||
          this.detalle_producto.MaterialName === null
        ) {
          this.SelectedMaterial.IdMaterial = " ";
          this.SelectedMaterial.Nombre = " ";
        } else {
          this.SelectedMaterial.IdMaterial = this.detalle_producto.IdMaterial;
          this.SelectedMaterial.Nombre = this.detalle_producto.MaterialName;
        }

        if (
          this.SelectedCentroCost.IdCentroCosto.length === 0 &&
          this.SelectedCentroCost.Nombre.length === 0 &&
          this.detalle_producto.IdCentroCostos.length === 0 &&
          this.detalle_producto.CECO.length === 0
        ) {
          console.log("dentro del if");
          this.SelectedCentroCost.IdCentroCosto = " ";
          this.SelectedCentroCost.Nombre = " ";
        } else if (
          this.SelectedCentroCost.IdCentroCosto.length === 0 &&
          this.SelectedCentroCost.Nombre.length === 0 &&
          this.detalle_producto.IdCentroCostos.length != 0 &&
          this.detalle_producto.CECO.length != 0
        ) {
          console.log("dentro del else if");
          this.SelectedCentroCost.IdCentroCosto =
            this.detalle_producto.IdCentroCostos;
          this.SelectedCentroCost.Nombre = this.detalle_producto.CECO;
        } else {
          console.log("se tomaran los valores del select");
        }
        if (
          this.SelectedCuentaMayor.IdCuentaMayor.length === 0 &&
          this.SelectedCuentaMayor.Nombre.length === 0 &&
          this.detalle_producto.IdCuentaMayor.length === 0 &&
          this.detalle_producto.CMAYOR.length === 0
        ) {
          this.SelectedCuentaMayor.IdCuentaMayor = " ";
          this.SelectedCuentaMayor.Nombre = " ";
        } else if (
          this.SelectedCuentaMayor.IdCuentaMayor.length === 0 &&
          this.SelectedCuentaMayor.Nombre.length === 0 &&
          this.detalle_producto.IdCuentaMayor.length != 0 &&
          this.detalle_producto.CMAYOR.length != 0
        ) {
          this.SelectedCuentaMayor.IdCuentaMayor =
            this.detalle_producto.IdCuentaMayor;
          this.SelectedCuentaMayor.Nombre = this.detalle_producto.CMAYOR;
        }
        console.log("GRUPO DE COMRPA" + this.SelectedGrupoComp);
        console.log(this.detalle_producto.IdGrupoCompra);
        console.log(this.detalle_producto.GrupoCompraName);
        if (
          this.SelectedGrupoComp.IdGrupoCompra === undefined &&
          this.SelectedGrupoComp.Nombre === undefined &&
          this.detalle_producto.IdGrupoCompra.length === 0 &&
          this.detalle_producto.GrupoCompraName.length === 0
        ) {
          console.log("datos dentro del if de grupos de compra");
          this.SelectedGrupoComp.IdGrupoCompra = 0;
          this.SelectedGrupoComp.Nombre = " ";
        } else if (
          this.SelectedGrupoComp.IdGrupoCompra === undefined &&
          this.SelectedGrupoComp.Nombre === undefined &&
          this.detalle_producto.IdGrupoCompra.length != 0 &&
          this.detalle_producto.GrupoCompraName.length != 0
        ) {
          console.log("dentro del else de griupo de compra");
          this.SelectedGrupoComp.IdGrupoCompra =
            this.detalle_producto.IdGrupoCompra;
          this.SelectedGrupoComp.Nombre = this.detalle_producto.GrupoCompraName;
        }

        if (
          this.SelectedUnidadMed.IdUnidadMedida === undefined &&
          this.SelectedUnidadMed.NombreUnidadMedida === undefined &&
          this.detalle_producto.IdUnidadMedida.length === 0 &&
          this.detalle_producto.MEDIDA.length === 0
        ) {
          this.SelectedUnidadMed.IdUnidadMedida = " ";
          this.SelectedUnidadMed.NombreUnidadMedida = " ";
        } else if (
          this.SelectedUnidadMed.IdUnidadMedida === undefined &&
          this.SelectedUnidadMed.NombreUnidadMedida === undefined &&
          this.detalle_producto.IdUnidadMedida.length != 0 &&
          this.detalle_producto.MEDIDA.length != 0
        ) {
          this.SelectedUnidadMed.IdUnidadMedida =
            this.detalle_producto.IdUnidadMedida;
          this.SelectedUnidadMed.NombreUnidadMedida =
            this.detalle_producto.MEDIDA;
        }
        if (
          this.SelectOrdenEstadisitica.IdOrdenInterna.length === 0 &&
          this.SelectOrdenEstadisitica.NombreOrder.length === 0 &&
          this.detalle_producto.IdOrdenEstadisitica === undefined &&
          this.detalle_producto.OrdenEstadisiticaName === undefined
        ) {
          console.log("datos de orden internaaaaa-----");
          this.SelectOrdenEstadisitica.IdOrdenInterna = " ";
          this.SelectOrdenEstadisitica.NombreOrder = " ";
        } else if (
          this.SelectOrdenEstadisitica.IdOrdenInterna.length === 0 &&
          this.SelectOrdenEstadisitica.NombreOrder.length === 0 &&
          this.detalle_producto.IdOrdenEstadisitica.length != 0 &&
          this.detalle_producto.OrdenEstadisiticaName.length != 0
        ) {
          console.log("datos de orden estadistica 2 ------------");
          this.SelectOrdenEstadisitica.IdOrdenInterna =
            this.detalle_producto.IdOrdenEstadisitica;
          this.SelectOrdenEstadisitica.NombreOrder =
            this.detalle_producto.OrdenEstadisiticaName;
        }
        if (
          this.SelectedNumActivo.IdActivo === undefined &&
          this.SelectedNumActivo.IdActivo === undefined &&
          this.detalle_producto.IdNumeroActivo.length === 0 &&
          this.detalle_producto.ACTFIJ.length === 0
        ) {
          this.SelectedNumActivo.IdActivo = " ";
          this.SelectedNumActivo.Nombre = " ";
        } else if (
          this.SelectedNumActivo.IdActivo === undefined &&
          this.SelectedNumActivo.IdActivo === undefined &&
          this.detalle_producto.IdNumeroActivo.length != 0 &&
          this.detalle_producto.ACTFIJ.length != 0
        ) {
          this.SelectedNumActivo.IdActivo =
            this.detalle_producto.IdNumeroActivo;
          this.SelectedNumActivo.Nombre = this.detalle_producto.ACTFIJ;
        }
        if (
          this.SelectedNecesidad.IdNecesidad === undefined &&
          this.SelectedNecesidad.Nombre === undefined &&
          this.detalle_producto.IdNecesidad.length === 0 &&
          this.detalle_producto.NumeroNecesidadName.length === 0
        ) {
          this.SelectedNecesidad.IdNecesidad = 0;
          this.SelectedNecesidad.Nombre = " ";
        } else if (
          this.SelectedNecesidad.IdNecesidad === undefined &&
          this.SelectedNecesidad.Nombre === undefined &&
          this.detalle_producto.IdNecesidad.length != 0 &&
          this.detalle_producto.NumeroNecesidadName.length != 0
        ) {
          this.SelectedNecesidad.IdNecesidad =
            this.detalle_producto.IdNecesidad;
          this.SelectedNecesidad.Nombre =
            this.detalle_producto.NumeroNecesidadName;
        }

        console.log(
          this.precio +
            " -- " +
            this.cantidad +
            " --- " +
            this.Espesificaciones +
            " -- " +
            this.UsoBien +
            "  "
        );
        // console.log(this.SelectedAlmacen);
        // console.log(this.SelectedMaterial);
        // console.log(this.SelectedCentroCost);
        // console.log(this.SelectedCuentaMayor);
        // console.log(this.SelectedGrupoComp);
        // console.log(this.SelectedUnidadMed);
        // console.log(this.SelectOrdenEstadisitica);
        // console.log(this.SelectedNumActivo);
        // console.log(this.SelectedNecesidad);
        //console.log("-------//////  STATUS id" + this.DataSolReg.IdStatusSolicitud);
        var IdSol = this.DataSolReg.ID;
        //realizamos el update de los campos que se requeran, si no tiene ningun valor se llena con el que ya se tien en DB
        this.solicitudComp
          .updateinfoProd(
            IdSol,
            this.detalle_producto.IdProducto,
            this.precio,
            this.cantidad,
            this.SelectedAlmacen.IdAlmacen,
            this.SelectedAlmacen.Nombre,
            this.SelectedMaterial.IdMaterial,
            this.SelectedMaterial.Nombre,
            this.SelectedCentroCost.IdCentroCosto,
            this.SelectedCentroCost.Nombre,
            this.SelectedCuentaMayor.IdCuentaMayor,
            this.SelectedCuentaMayor.Nombre,
            this.SelectedGrupoComp.IdGrupoCompra,
            this.SelectedGrupoComp.Nombre,
            this.SelectedUnidadMed.IdUnidadMedida,
            this.SelectedUnidadMed.NombreUnidadMedida,
            this.SelectOrdenEstadisitica.IdOrdenInterna,
            this.SelectOrdenEstadisitica.NombreOrder,
            this.SelectedNumActivo.IdActivo,
            this.SelectedNumActivo.Nombre,
            this.SelectedNecesidad.IdNecesidad,
            this.SelectedNecesidad.Nombre,
            this.Espesificaciones,
            this.UsoBien,
            this.newStatus
          )
          .subscribe(
            (data) => {
              console.log(data);
              this.precio = 0;
              this.cantidad = 0;
              this.SelectedAlmacen = new Almacen();
              this.SelectedMaterial = new Materiales();
              this.SelectedCentroCost = new CentroCostos();
              this.SelectedCuentaMayor = new CuentaMayor();
              this.SelectedGrupoComp = new GrupoCompra();
              this.SelectedUnidadMed = new UnidadMedida();
              this.SelectOrdenEstadisitica = new OrdenInterna();
              this.SelectedNumActivo = new Activo();
              this.SelectedNecesidad = new Necesidad();
              this.Espesificaciones = "";
              this.UsoBien = "";
              this.toast.setMessage(
                "Puedes seguir editando, datos guardados",
                "success"
              );
              //this.cancelEditing();
            },
            (err) => {
              console.log(err);
              this.precio = 0;
              this.cantidad = 0;
              this.SelectedAlmacen = new Almacen();
              this.SelectedMaterial = new Materiales();
              this.SelectedCentroCost = new CentroCostos();
              this.SelectedCuentaMayor = new CuentaMayor();
              this.SelectedGrupoComp = new GrupoCompra();
              this.SelectedUnidadMed = new UnidadMedida();
              this.SelectOrdenEstadisitica = new OrdenInterna();
              this.SelectedNumActivo = new Activo();
              this.SelectedNecesidad = new Necesidad();
              this.Espesificaciones = "";
              this.UsoBien = "";
              this.toast.setMessage(
                "Error al actualizar el Producto " + err,
                "danger"
              );
            }
          );
      }
    } else if (this.DataSolReg.IdSol === 4) {
      console.log("SERVICIOS");
      if (
        // this.precio == undefined || this.precio == 0 &&
        // this.cantidad == undefined || this.cantidad == 0 &&
        this.Espesificaciones == undefined &&
        this.UsoBien == undefined &&
        // this.SelectedAlmacen.IdAlmacen === undefined || this.SelectedAlmacen.IdAlmacen === '' &&
        // this.SelectedAlmacen.Nombre === undefined || this.SelectedAlmacen.Nombre === '' &&
        // this.SelectedMaterial.IdMaterial === undefined || this.SelectedMaterial.IdMaterial === '' &&
        // this.SelectedMaterial.Nombre === undefined || this.SelectedMaterial.Nombre === '' &&
        // this.SelectedCentroCost.IdCentroCosto === undefined || this.SelectedCentroCost.IdCentroCosto === '' &&
        // this.SelectedCentroCost.Nombre === undefined || this.SelectedCentroCost.Nombre === '' &&
        // this.SelectedCuentaMayor.IdCuentaMayor === undefined || this.SelectedCuentaMayor.IdCuentaMayor === '' &&
        // this.SelectedCuentaMayor.Nombre === undefined || this.SelectedCuentaMayor.Nombre === '' &&
        this.SelectedGrupoComp.IdGrupoCompra === undefined &&
        this.SelectedGrupoComp.Nombre === undefined &&
        // this.SelectedUnidadMed.IdUnidadMedida === undefined || this.SelectedUnidadMed.IdUnidadMedida === '' &&
        // this.SelectedUnidadMed.NombreUnidadMedida === undefined || this.SelectedUnidadMed.NombreUnidadMedida === '' &&
        // this.SelectOrdenEstadisitica.IdOrdenInterna === undefined || this.SelectOrdenEstadisitica.IdOrdenInterna === '' &&
        // this.SelectOrdenEstadisitica.NombreOrder === undefined || this.SelectOrdenEstadisitica.NombreOrder === '' &&
        // this.SelectedNumActivo.IdActivo === undefined || this.SelectedNumActivo.IdActivo === '' &&
        // this.SelectedNumActivo.Nombre === undefined || this.SelectedNumActivo.Nombre === '' &&
        this.SelectedNecesidad.IdNecesidad === undefined &&
        this.SelectedNecesidad.Nombre === undefined
      ) {
        this.toast.setMessage(
          "si se requiere actualizar un producto, se debe de llenar almenos un campo o seleccionar una opcion",
          "warning"
        );
      } else {
        if (this.precio == undefined || this.precio == 0) {
          this.precio = this.detalle_producto.Precio;
          //this.priceS = this.detalle_producto.PRECIO.toString();
        }
        if (this.cantidad == undefined || this.cantidad == 0) {
          this.cantidad = this.detalle_producto.CANTIDAD;
        }
        if (this.Espesificaciones == undefined) {
          this.Espesificaciones = this.detalle_producto.EspGenerales;
        }
        if (this.UsoBien == undefined) {
          this.UsoBien = this.detalle_producto.BIENOSERV;
        }
        if (
          (this.SelectedAlmacen === undefined &&
            this.detalle_producto.IdAlmacen === undefined) ||
          (this.detalle_producto.IdAlmacen === null &&
            this.detalle_producto.AlmacenName === undefined) ||
          this.detalle_producto.AlmacenName === null
        ) {
          this.SelectedAlmacen.IdAlmacen = " ";
          this.SelectedAlmacen.Nombre = " ";
        } else {
          this.SelectedAlmacen.IdAlmacen = this.detalle_producto.IdAlmacen;
          this.SelectedAlmacen.Nombre = this.detalle_producto.AlmacenName;
        }

        if (
          (this.SelectedMaterial === undefined &&
            this.detalle_producto.IdMaterial === undefined) ||
          (this.detalle_producto.IdMaterial === null &&
            this.detalle_producto.MaterialName === undefined) ||
          this.detalle_producto.MaterialName === null
        ) {
          this.SelectedMaterial.IdMaterial = " ";
          this.SelectedMaterial.Nombre = " ";
        } else {
          this.SelectedMaterial.IdMaterial = this.detalle_producto.IdMaterial;
          this.SelectedMaterial.Nombre = this.detalle_producto.MaterialName;
        }

        if (
          this.SelectedCentroCost.IdCentroCosto.length === 0 &&
          this.SelectedCentroCost.Nombre.length === 0 &&
          this.detalle_producto.IdCentroCostos === undefined &&
          this.detalle_producto.CECO === undefined
        ) {
          console.log("dentro del if");
          this.SelectedCentroCost.IdCentroCosto = " ";
          this.SelectedCentroCost.Nombre = " ";
        } else if (
          this.SelectedCentroCost.IdCentroCosto.length === 0 &&
          this.SelectedCentroCost.Nombre.length === 0 &&
          this.detalle_producto.IdCentroCostos != undefined &&
          this.detalle_producto.CECO != undefined
        ) {
          console.log("dentro del else if");
          this.SelectedCentroCost.IdCentroCosto =
            this.detalle_producto.IdCentroCostos;
          this.SelectedCentroCost.Nombre = this.detalle_producto.CECO;
        } else {
          console.log("se tomaran los valores del select");
        }
        if (
          this.SelectedCuentaMayor.IdCuentaMayor.length === 0 &&
          this.SelectedCuentaMayor.Nombre.length === 0 &&
          this.detalle_producto.IdCuentaMayor === 0 &&
          this.detalle_producto.CMAYOR === 0
        ) {
          this.SelectedCuentaMayor.IdCuentaMayor = " ";
          this.SelectedCuentaMayor.Nombre = " ";
        } else if (
          this.SelectedCuentaMayor.IdCuentaMayor.length === 0 &&
          this.SelectedCuentaMayor.Nombre.length === 0 &&
          this.detalle_producto.IdCuentaMayor != 0 &&
          this.detalle_producto.CMAYOR != 0
        ) {
          this.SelectedCuentaMayor.IdCuentaMayor =
            this.detalle_producto.IdCuentaMayor;
          this.SelectedCuentaMayor.Nombre = this.detalle_producto.CMAYOR;
        }
        console.log("GRUPO DE COMRPA" + this.SelectedGrupoComp);
        console.log(this.detalle_producto.IdGrupoCompra);
        console.log(this.detalle_producto.GrupoCompraName);
        if (
          this.SelectedGrupoComp.IdGrupoCompra === undefined &&
          this.SelectedGrupoComp.Nombre === undefined &&
          this.detalle_producto.IdGrupoCompra === undefined &&
          this.detalle_producto.GrupoCompraName === undefined
        ) {
          console.log("datos dentro del if de grupos de compra");
          this.SelectedGrupoComp.IdGrupoCompra = 0;
          this.SelectedGrupoComp.Nombre = " ";
        } else if (
          this.SelectedGrupoComp.IdGrupoCompra === undefined &&
          this.SelectedGrupoComp.Nombre === undefined &&
          this.detalle_producto.IdGrupoCompra != undefined &&
          this.detalle_producto.GrupoCompraName != undefined
        ) {
          console.log("dentro del else de griupo de compra");
          this.SelectedGrupoComp.IdGrupoCompra =
            this.detalle_producto.IdGrupoCompra;
          this.SelectedGrupoComp.Nombre = this.detalle_producto.GrupoCompraName;
        }

        if (
          this.SelectedUnidadMed.IdUnidadMedida === undefined &&
          this.SelectedUnidadMed.NombreUnidadMedida === undefined &&
          this.detalle_producto.IdUnidadMedida.length === 0 &&
          this.detalle_producto.MEDIDA.length === 0
        ) {
          this.SelectedUnidadMed.IdUnidadMedida = " ";
          this.SelectedUnidadMed.NombreUnidadMedida = " ";
        } else if (
          this.SelectedUnidadMed.IdUnidadMedida === undefined &&
          this.SelectedUnidadMed.NombreUnidadMedida === undefined &&
          this.detalle_producto.IdUnidadMedida.length != 0 &&
          this.detalle_producto.MEDIDA.length != 0
        ) {
          this.SelectedUnidadMed.IdUnidadMedida =
            this.detalle_producto.IdUnidadMedida;
          this.SelectedUnidadMed.NombreUnidadMedida =
            this.detalle_producto.MEDIDA;
        }
        if (
          this.SelectOrdenEstadisitica.IdOrdenInterna.length === 0 &&
          this.SelectOrdenEstadisitica.NombreOrder.length === 0 &&
          this.detalle_producto.IdOrdenEstadisitica === undefined &&
          this.detalle_producto.OrdenEstadisiticaName === undefined
        ) {
          console.log("datos de orden internaaaaa-----");
          this.SelectOrdenEstadisitica.IdOrdenInterna = " ";
          this.SelectOrdenEstadisitica.NombreOrder = " ";
        } else if (
          this.SelectOrdenEstadisitica.IdOrdenInterna.length === 0 &&
          this.SelectOrdenEstadisitica.NombreOrder.length === 0 &&
          this.detalle_producto.IdOrdenEstadisitica.length != 0 &&
          this.detalle_producto.OrdenEstadisiticaName.length != 0
        ) {
          console.log("datos de orden estadistica 2 ------------");
          this.SelectOrdenEstadisitica.IdOrdenInterna =
            this.detalle_producto.IdOrdenEstadisitica;
          this.SelectOrdenEstadisitica.NombreOrder =
            this.detalle_producto.OrdenEstadisiticaName;
        }
        if (
          this.SelectedNumActivo.IdActivo === undefined &&
          this.SelectedNumActivo.IdActivo === undefined &&
          this.detalle_producto.IdNumeroActivo === undefined &&
          this.detalle_producto.ACTFIJ === undefined
        ) {
          this.SelectedNumActivo.IdActivo = " ";
          this.SelectedNumActivo.Nombre = " ";
        } else if (
          this.SelectedNumActivo.IdActivo === undefined &&
          this.SelectedNumActivo.IdActivo === undefined &&
          this.detalle_producto.IdNumeroActivo != undefined &&
          this.detalle_producto.ACTFIJ != undefined
        ) {
          this.SelectedNumActivo.IdActivo =
            this.detalle_producto.IdNumeroActivo;
          this.SelectedNumActivo.Nombre = this.detalle_producto.ACTFIJ;
        }
        if (
          this.SelectedNecesidad.IdNecesidad === undefined &&
          this.SelectedNecesidad.Nombre === undefined &&
          this.detalle_producto.IdNecesidad.length === 0 &&
          this.detalle_producto.NumeroNecesidadName.length === 0
        ) {
          this.SelectedNecesidad.IdNecesidad = 0;
          this.SelectedNecesidad.Nombre = " ";
        } else if (
          this.SelectedNecesidad.IdNecesidad === undefined &&
          this.SelectedNecesidad.Nombre === undefined &&
          this.detalle_producto.IdNecesidad.length != 0 &&
          this.detalle_producto.NumeroNecesidadName.length != 0
        ) {
          this.SelectedNecesidad.IdNecesidad =
            this.detalle_producto.IdNecesidad;
          this.SelectedNecesidad.Nombre =
            this.detalle_producto.NumeroNecesidadName;
        }

        console.log(
          this.precio +
            " -- " +
            this.cantidad +
            " --- " +
            this.Espesificaciones +
            " -- " +
            this.UsoBien +
            "  "
        );
        // console.log(this.SelectedAlmacen);
        // console.log(this.SelectedMaterial);
        // console.log(this.SelectedCentroCost);
        // console.log(this.SelectedCuentaMayor);
        // console.log(this.SelectedGrupoComp);
        // console.log(this.SelectedUnidadMed);
        // console.log(this.SelectOrdenEstadisitica);
        // console.log(this.SelectedNumActivo);
        // console.log(this.SelectedNecesidad);
        //console.log("-------//////  STATUS id" + this.DataSolReg.IdStatusSolicitud);

        var IdSol = this.DataSolReg.ID;
        //realizamos el update de los campos que se requeran, si no tiene ningun valor se llena con el que ya se tien en DB
        this.solicitudComp
          .updateinfoProd(
            IdSol,
            this.detalle_producto.IdProducto,
            this.precio,
            this.cantidad,
            this.SelectedAlmacen.IdAlmacen,
            this.SelectedAlmacen.Nombre,
            this.SelectedMaterial.IdMaterial,
            this.SelectedMaterial.Nombre,
            this.SelectedCentroCost.IdCentroCosto,
            this.SelectedCentroCost.Nombre,
            this.SelectedCuentaMayor.IdCuentaMayor,
            this.SelectedCuentaMayor.Nombre,
            this.SelectedGrupoComp.IdGrupoCompra,
            this.SelectedGrupoComp.Nombre,
            this.SelectedUnidadMed.IdUnidadMedida,
            this.SelectedUnidadMed.NombreUnidadMedida,
            this.SelectOrdenEstadisitica.IdOrdenInterna,
            this.SelectOrdenEstadisitica.NombreOrder,
            this.SelectedNumActivo.IdActivo,
            this.SelectedNumActivo.Nombre,
            this.SelectedNecesidad.IdNecesidad,
            this.SelectedNecesidad.Nombre,
            this.Espesificaciones,
            this.UsoBien,
            this.newStatus
          )
          .subscribe(
            (data) => {
              console.log(data);
              this.precio = 0;
              this.cantidad = 0;
              this.SelectedAlmacen = new Almacen();
              this.SelectedMaterial = new Materiales();
              this.SelectedCentroCost = new CentroCostos();
              this.SelectedCuentaMayor = new CuentaMayor();
              this.SelectedGrupoComp = new GrupoCompra();
              this.SelectedUnidadMed = new UnidadMedida();
              this.SelectOrdenEstadisitica = new OrdenInterna();
              this.SelectedNumActivo = new Activo();
              this.SelectedNecesidad = new Necesidad();
              this.Espesificaciones = "";
              this.UsoBien = "";
              this.toast.setMessage(
                "Puedes seguir editando, datos guardados",
                "success"
              );
              
            },
            (err) => {
              console.log(err);
              this.precio = 0;
              this.cantidad = 0;
              this.SelectedAlmacen = new Almacen();
              this.SelectedMaterial = new Materiales();
              this.SelectedCentroCost = new CentroCostos();
              this.SelectedCuentaMayor = new CuentaMayor();
              this.SelectedGrupoComp = new GrupoCompra();
              this.SelectedUnidadMed = new UnidadMedida();
              this.SelectOrdenEstadisitica = new OrdenInterna();
              this.SelectedNumActivo = new Activo();
              this.SelectedNecesidad = new Necesidad();
              this.Espesificaciones = "";
              this.UsoBien = "";
              this.toast.setMessage(
                "Error al actualizar el producto " + err,
                "danger"
              );
            }
          );
      }
    } else if (this.DataSolReg.IdSol === 5) {
      console.log("COMPRAS DE ARTICULOS INVENTARIADOS");
      if (
        this.precio == undefined ||
        (this.precio == 0 && this.cantidad == undefined) ||
        (this.cantidad == 0 && this.Espesificaciones == undefined) ||
        (this.Espesificaciones == "" && this.UsoBien == undefined) ||
        (this.UsoBien == "" && this.SelectedAlmacen.IdAlmacen === undefined) ||
        (this.SelectedAlmacen.IdAlmacen === "" &&
          this.SelectedAlmacen.Nombre === undefined) ||
        (this.SelectedAlmacen.Nombre === "" &&
          this.SelectedMaterial.IdMaterial === undefined) ||
        (this.SelectedMaterial.IdMaterial === "" &&
          this.SelectedMaterial.Nombre === undefined) ||
        (this.SelectedMaterial.Nombre === "" &&
          // this.SelectedCentroCost.IdCentroCosto === undefined || this.SelectedCentroCost.IdCentroCosto === '' &&
          // this.SelectedCentroCost.Nombre === undefined || this.SelectedCentroCost.Nombre === '' &&
          // this.SelectedCuentaMayor.IdCuentaMayor === undefined || this.SelectedCuentaMayor.IdCuentaMayor === '' &&
          // this.SelectedCuentaMayor.Nombre === undefined || this.SelectedCuentaMayor.Nombre === '' &&
          this.SelectedGrupoComp.IdGrupoCompra === undefined) ||
        (this.SelectedGrupoComp.IdGrupoCompra === 0 &&
          this.SelectedGrupoComp.Nombre === undefined) ||
        (this.SelectedGrupoComp.Nombre === "" &&
          this.SelectedUnidadMed.IdUnidadMedida === undefined) ||
        (this.SelectedUnidadMed.IdUnidadMedida === "" &&
          this.SelectedUnidadMed.NombreUnidadMedida === undefined) ||
        (this.SelectedUnidadMed.NombreUnidadMedida === "" &&
          // this.SelectOrdenEstadisitica.IdOrdenInterna === undefined || this.SelectOrdenEstadisitica.IdOrdenInterna === '' &&
          // this.SelectOrdenEstadisitica.NombreOrder === undefined || this.SelectOrdenEstadisitica.NombreOrder === '' &&
          // this.SelectedNumActivo.IdActivo === undefined || this.SelectedNumActivo.IdActivo === '' &&
          // this.SelectedNumActivo.Nombre === undefined || this.SelectedNumActivo.Nombre === '' &&
          this.SelectedNecesidad.IdNecesidad === undefined) ||
        (this.SelectedNecesidad.IdNecesidad === 0 &&
          this.SelectedNecesidad.Nombre === undefined) ||
        this.SelectedNecesidad.Nombre === ""
      ) {
        this.toast.setMessage(
          "si se requiere actualizar un producto, se debe de llenar almenos un campo o seleccionar una opcion",
          "warning"
        );
      } else {
        if (this.precio == undefined) {
          this.precio = this.detalle_producto.Precio;
          //this.priceS = this.detalle_producto.PRECIO.toString();
        }
        if (this.cantidad == undefined) {
          this.cantidad = this.detalle_producto.CANTIDAD;
        }
        if (this.Espesificaciones == undefined) {
          this.Espesificaciones = this.detalle_producto.EspGenerales;
        }
        if (this.UsoBien == undefined) {
          this.UsoBien = this.detalle_producto.BIENOSERV;
        }
        if (
          (this.SelectedAlmacen === undefined &&
            this.detalle_producto.IdAlmacen === undefined) ||
          (this.detalle_producto.IdAlmacen === null &&
            this.detalle_producto.AlmacenName === undefined) ||
          this.detalle_producto.AlmacenName === null
        ) {
          this.SelectedAlmacen.IdAlmacen = " ";
          this.SelectedAlmacen.Nombre = " ";
        } else {
          this.SelectedAlmacen.IdAlmacen = this.detalle_producto.IdAlmacen;
          this.SelectedAlmacen.Nombre = this.detalle_producto.AlmacenName;
        }

        if (
          (this.SelectedMaterial === undefined &&
            this.detalle_producto.IdMaterial === undefined) ||
          (this.detalle_producto.IdMaterial === null &&
            this.detalle_producto.MaterialName === undefined) ||
          this.detalle_producto.MaterialName === null
        ) {
          this.SelectedMaterial.IdMaterial = " ";
          this.SelectedMaterial.Nombre = " ";
        } else {
          this.SelectedMaterial.IdMaterial = this.detalle_producto.IdMaterial;
          this.SelectedMaterial.Nombre = this.detalle_producto.MaterialName;
        }

        if (
          this.SelectedCentroCost.IdCentroCosto.length === 0 &&
          this.SelectedCentroCost.Nombre.length === 0 &&
          this.detalle_producto.IdCentroCostos.length === 0 &&
          this.detalle_producto.CECO.length === 0
        ) {
          console.log("dentro del if");
          this.SelectedCentroCost.IdCentroCosto = " ";
          this.SelectedCentroCost.Nombre = " ";
        } else if (
          this.SelectedCentroCost.IdCentroCosto.length === 0 &&
          this.SelectedCentroCost.Nombre.length === 0 &&
          this.detalle_producto.IdCentroCostos.length != 0 &&
          this.detalle_producto.CECO.length != 0
        ) {
          console.log("dentro del else if");
          this.SelectedCentroCost.IdCentroCosto =
            this.detalle_producto.IdCentroCostos;
          this.SelectedCentroCost.Nombre = this.detalle_producto.CECO;
        } else {
          console.log("se tomaran los valores del select");
        }
        if (
          this.SelectedCuentaMayor.IdCuentaMayor.length === 0 &&
          this.SelectedCuentaMayor.Nombre.length === 0 &&
          this.detalle_producto.IdCuentaMayor.length === 0 &&
          this.detalle_producto.CMAYOR.length === 0
        ) {
          this.SelectedCuentaMayor.IdCuentaMayor = " ";
          this.SelectedCuentaMayor.Nombre = " ";
        } else if (
          this.SelectedCuentaMayor.IdCuentaMayor.length === 0 &&
          this.SelectedCuentaMayor.Nombre.length === 0 &&
          this.detalle_producto.IdCuentaMayor.length != 0 &&
          this.detalle_producto.CMAYOR.length != 0
        ) {
          this.SelectedCuentaMayor.IdCuentaMayor =
            this.detalle_producto.IdCuentaMayor;
          this.SelectedCuentaMayor.Nombre = this.detalle_producto.CMAYOR;
        }
        console.log("GRUPO DE COMRPA" + this.SelectedGrupoComp);
        console.log(this.detalle_producto.IdGrupoCompra);
        console.log(this.detalle_producto.GrupoCompraName);
        if (
          this.SelectedGrupoComp.IdGrupoCompra === undefined &&
          this.SelectedGrupoComp.Nombre === undefined &&
          this.detalle_producto.IdGrupoCompra.length === 0 &&
          this.detalle_producto.GrupoCompraName.length === 0
        ) {
          console.log("datos dentro del if de grupos de compra");
          this.SelectedGrupoComp.IdGrupoCompra = 0;
          this.SelectedGrupoComp.Nombre = " ";
        } else if (
          this.SelectedGrupoComp.IdGrupoCompra === undefined &&
          this.SelectedGrupoComp.Nombre === undefined &&
          this.detalle_producto.IdGrupoCompra.length != 0 &&
          this.detalle_producto.GrupoCompraName.length != 0
        ) {
          console.log("dentro del else de griupo de compra");
          this.SelectedGrupoComp.IdGrupoCompra =
            this.detalle_producto.IdGrupoCompra;
          this.SelectedGrupoComp.Nombre = this.detalle_producto.GrupoCompraName;
        }

        if (
          this.SelectedUnidadMed.IdUnidadMedida === undefined &&
          this.SelectedUnidadMed.NombreUnidadMedida === undefined &&
          this.detalle_producto.IdUnidadMedida.length === 0 &&
          this.detalle_producto.MEDIDA.length === 0
        ) {
          this.SelectedUnidadMed.IdUnidadMedida = " ";
          this.SelectedUnidadMed.NombreUnidadMedida = " ";
        } else if (
          this.SelectedUnidadMed.IdUnidadMedida === undefined &&
          this.SelectedUnidadMed.NombreUnidadMedida === undefined &&
          this.detalle_producto.IdUnidadMedida.length != 0 &&
          this.detalle_producto.MEDIDA.length != 0
        ) {
          this.SelectedUnidadMed.IdUnidadMedida =
            this.detalle_producto.IdUnidadMedida;
          this.SelectedUnidadMed.NombreUnidadMedida =
            this.detalle_producto.MEDIDA;
        }
        if (
          this.SelectOrdenEstadisitica.IdOrdenInterna.length === 0 &&
          this.SelectOrdenEstadisitica.NombreOrder.length === 0 &&
          this.detalle_producto.IdOrdenEstadisitica === undefined &&
          this.detalle_producto.OrdenEstadisiticaName === undefined
        ) {
          console.log("datos de orden internaaaaa-----");
          this.SelectOrdenEstadisitica.IdOrdenInterna = " ";
          this.SelectOrdenEstadisitica.NombreOrder = " ";
        } else if (
          this.SelectOrdenEstadisitica.IdOrdenInterna.length === 0 &&
          this.SelectOrdenEstadisitica.NombreOrder.length === 0 &&
          this.detalle_producto.IdOrdenEstadisitica.length != 0 &&
          this.detalle_producto.OrdenEstadisiticaName.length != 0
        ) {
          console.log("datos de orden estadistica 2 ------------");
          this.SelectOrdenEstadisitica.IdOrdenInterna =
            this.detalle_producto.IdOrdenEstadisitica;
          this.SelectOrdenEstadisitica.NombreOrder =
            this.detalle_producto.OrdenEstadisiticaName;
        }
        if (
          this.SelectedNumActivo.IdActivo === undefined &&
          this.SelectedNumActivo.IdActivo === undefined &&
          this.detalle_producto.IdNumeroActivo.length === 0 &&
          this.detalle_producto.ACTFIJ.length === 0
        ) {
          this.SelectedNumActivo.IdActivo = " ";
          this.SelectedNumActivo.Nombre = " ";
        } else if (
          this.SelectedNumActivo.IdActivo === undefined &&
          this.SelectedNumActivo.IdActivo === undefined &&
          this.detalle_producto.IdNumeroActivo.length != 0 &&
          this.detalle_producto.ACTFIJ.length != 0
        ) {
          this.SelectedNumActivo.IdActivo =
            this.detalle_producto.IdNumeroActivo;
          this.SelectedNumActivo.Nombre = this.detalle_producto.ACTFIJ;
        }
        if (
          this.SelectedNecesidad.IdNecesidad === undefined &&
          this.SelectedNecesidad.Nombre === undefined &&
          this.detalle_producto.IdNecesidad.length === 0 &&
          this.detalle_producto.NumeroNecesidadName.length === 0
        ) {
          this.SelectedNecesidad.IdNecesidad = 0;
          this.SelectedNecesidad.Nombre = " ";
        } else if (
          this.SelectedNecesidad.IdNecesidad === undefined &&
          this.SelectedNecesidad.Nombre === undefined &&
          this.detalle_producto.IdNecesidad.length != 0 &&
          this.detalle_producto.NumeroNecesidadName.length != 0
        ) {
          this.SelectedNecesidad.IdNecesidad =
            this.detalle_producto.IdNecesidad;
          this.SelectedNecesidad.Nombre =
            this.detalle_producto.NumeroNecesidadName;
        }

        console.log(
          this.precio +
            " -- " +
            this.cantidad +
            " --- " +
            this.Espesificaciones +
            " -- " +
            this.UsoBien +
            "  "
        );
        // console.log(this.SelectedAlmacen);
        // console.log(this.SelectedMaterial);
        // console.log(this.SelectedCentroCost);
        // console.log(this.SelectedCuentaMayor);
        // console.log(this.SelectedGrupoComp);
        // console.log(this.SelectedUnidadMed);
        // console.log(this.SelectOrdenEstadisitica);
        // console.log(this.SelectedNumActivo);
        // console.log(this.SelectedNecesidad);
        console.log("-------//////  STATUS id" + this.DataSolReg.IdStatusSolicitud);
        var IdSol = this.DataSolReg.ID;
        //realizamos el update de los campos que se requeran, si no tiene ningun valor se llena con el que ya se tien en DB
        this.solicitudComp
          .updateinfoProd(
            IdSol,
            this.detalle_producto.IdProducto,
            this.precio,
            this.cantidad,
            this.SelectedAlmacen.IdAlmacen,
            this.SelectedAlmacen.Nombre,
            this.SelectedMaterial.IdMaterial,
            this.SelectedMaterial.Nombre,
            this.SelectedCentroCost.IdCentroCosto,
            this.SelectedCentroCost.Nombre,
            this.SelectedCuentaMayor.IdCuentaMayor,
            this.SelectedCuentaMayor.Nombre,
            this.SelectedGrupoComp.IdGrupoCompra,
            this.SelectedGrupoComp.Nombre,
            this.SelectedUnidadMed.IdUnidadMedida,
            this.SelectedUnidadMed.NombreUnidadMedida,
            this.SelectOrdenEstadisitica.IdOrdenInterna,
            this.SelectOrdenEstadisitica.NombreOrder,
            this.SelectedNumActivo.IdActivo,
            this.SelectedNumActivo.Nombre,
            this.SelectedNecesidad.IdNecesidad,
            this.SelectedNecesidad.Nombre,
            this.Espesificaciones,
            this.UsoBien,
            this.newStatus
          )
          .subscribe(
            (data) => {
              console.log(data);
              this.precio = 0;
              this.cantidad = 0;
              this.SelectedAlmacen = new Almacen();
              this.SelectedMaterial = new Materiales();
              this.SelectedCentroCost = new CentroCostos();
              this.SelectedCuentaMayor = new CuentaMayor();
              this.SelectedGrupoComp = new GrupoCompra();
              this.SelectedUnidadMed = new UnidadMedida();
              this.SelectOrdenEstadisitica = new OrdenInterna();
              this.SelectedNumActivo = new Activo();
              this.SelectedNecesidad = new Necesidad();
              this.Espesificaciones = "";
              this.UsoBien = "";
              this.toast.setMessage(
                "Puedes seguir editando , datos guardados",
                "sucsess"
              );
              //this.cancelEditing();
            },
            (err) => {
              console.log(err);
              this.precio = 0;
              this.cantidad = 0;
              this.SelectedAlmacen = new Almacen();
              this.SelectedMaterial = new Materiales();
              this.SelectedCentroCost = new CentroCostos();
              this.SelectedCuentaMayor = new CuentaMayor();
              this.SelectedGrupoComp = new GrupoCompra();
              this.SelectedUnidadMed = new UnidadMedida();
              this.SelectOrdenEstadisitica = new OrdenInterna();
              this.SelectedNumActivo = new Activo();
              this.SelectedNecesidad = new Necesidad();
              this.Espesificaciones = "";
              this.UsoBien = "";
              this.toast.setMessage(
                "Error al actualizar el Producto",
                "danger"
              );
            }
          );
      }
    } else if (this.DataSolReg.IdSol === 6) {
      console.log("PRODUCCIONES");
      if (
        this.precio == undefined ||
        (this.precio == 0 && this.cantidad == undefined) ||
        (this.cantidad == 0 &&
          this.Espesificaciones == undefined &&
          this.UsoBien == undefined &&
          // this.SelectedAlmacen.IdAlmacen === undefined || this.SelectedAlmacen.IdAlmacen === '' &&
          // this.SelectedAlmacen.Nombre === undefined || this.SelectedAlmacen.Nombre === '' &&
          // this.SelectedMaterial.IdMaterial === undefined || this.SelectedMaterial.IdMaterial === '' &&
          // this.SelectedMaterial.Nombre === undefined || this.SelectedMaterial.Nombre === '' &&
          this.SelectedCentroCost.IdCentroCosto === undefined &&
          this.SelectedCentroCost.Nombre === undefined &&
          this.SelectedCuentaMayor.IdCuentaMayor === undefined &&
          this.SelectedCuentaMayor.Nombre === undefined &&
          this.SelectedGrupoComp.IdGrupoCompra === undefined &&
          this.SelectedGrupoComp.Nombre === undefined &&
          this.SelectedUnidadMed.IdUnidadMedida === undefined &&
          this.SelectedUnidadMed.NombreUnidadMedida === undefined &&
          this.SelectOrdenEstadisitica.IdOrdenInterna === undefined &&
          this.SelectOrdenEstadisitica.NombreOrder === undefined &&
          // this.SelectedNumActivo.IdActivo === undefined || this.SelectedNumActivo.IdActivo === '' &&
          // this.SelectedNumActivo.Nombre === undefined || this.SelectedNumActivo.Nombre === '' &&
          this.SelectedNecesidad.IdNecesidad === undefined &&
          this.SelectedNecesidad.Nombre === undefined)
      ) {
        this.toast.setMessage(
          "si se requiere actualizar un producto, se debe de llenar almenos un campo o seleccionar una opcion",
          "warning"
        );
      } else {
        if (this.precio == undefined || this.precio == 0) {
          this.precio = this.detalle_producto.Precio;
          //this.priceS = this.detalle_producto.PRECIO.toString();
        }
        if (this.cantidad == undefined || this.cantidad == 0) {
          this.cantidad = this.detalle_producto.CANTIDAD;
        }
        if (this.Espesificaciones == undefined || this.Espesificaciones == "") {
          this.Espesificaciones = this.detalle_producto.EspGenerales;
        }
        if (this.UsoBien == undefined || this.UsoBien == "") {
          this.UsoBien = this.detalle_producto.BIENOSERV;
        }
        if (
          (this.SelectedAlmacen === undefined &&
            this.detalle_producto.IdAlmacen === undefined) ||
          (this.detalle_producto.IdAlmacen === null &&
            this.detalle_producto.AlmacenName === undefined) ||
          this.detalle_producto.AlmacenName === null
        ) {
          this.SelectedAlmacen.IdAlmacen = " ";
          this.SelectedAlmacen.Nombre = " ";
        } else {
          this.SelectedAlmacen.IdAlmacen = this.detalle_producto.IdAlmacen;
          this.SelectedAlmacen.Nombre = this.detalle_producto.AlmacenName;
        }

        if (
          (this.SelectedMaterial === undefined &&
            this.detalle_producto.IdMaterial === undefined) ||
          (this.detalle_producto.IdMaterial === null &&
            this.detalle_producto.MaterialName === undefined) ||
          this.detalle_producto.MaterialName === null
        ) {
          this.SelectedMaterial.IdMaterial = " ";
          this.SelectedMaterial.Nombre = " ";
        } else {
          this.SelectedMaterial.IdMaterial = this.detalle_producto.IdMaterial;
          this.SelectedMaterial.Nombre = this.detalle_producto.MaterialName;
        }

        if (
          this.SelectedCentroCost.IdCentroCosto.length === 0 &&
          this.SelectedCentroCost.Nombre.length === 0 &&
          this.detalle_producto.IdCentroCostos === undefined &&
          this.detalle_producto.CECO === undefined
        ) {
          console.log("dentro del if");
          this.SelectedCentroCost.IdCentroCosto = " ";
          this.SelectedCentroCost.Nombre = " ";
        } else if (
          this.SelectedCentroCost.IdCentroCosto.length === 0 &&
          this.SelectedCentroCost.Nombre.length === 0 &&
          this.detalle_producto.IdCentroCostos.length != 0 &&
          this.detalle_producto.CECO.length != 0
        ) {
          console.log("dentro del else if");
          this.SelectedCentroCost.IdCentroCosto =
            this.detalle_producto.IdCentroCostos;
          this.SelectedCentroCost.Nombre = this.detalle_producto.CECO;
        } else {
          console.log("se tomaran los valores del select");
        }
        if (
          this.SelectedCuentaMayor.IdCuentaMayor.length === 0 &&
          this.SelectedCuentaMayor.Nombre.length === 0 &&
          this.detalle_producto.IdCuentaMayor === undefined &&
          this.detalle_producto.CMAYOR === undefined
        ) {
          this.SelectedCuentaMayor.IdCuentaMayor = " ";
          this.SelectedCuentaMayor.Nombre = " ";
        } else if (
          this.SelectedCuentaMayor.IdCuentaMayor.length === 0 &&
          this.SelectedCuentaMayor.Nombre.length === 0 &&
          this.detalle_producto.IdCuentaMayor.length != 0 &&
          this.detalle_producto.CMAYOR.length != 0
        ) {
          this.SelectedCuentaMayor.IdCuentaMayor =
            this.detalle_producto.IdCuentaMayor;
          this.SelectedCuentaMayor.Nombre = this.detalle_producto.CMAYOR;
        }
        console.log("GRUPO DE COMRPA" + this.SelectedGrupoComp);
        console.log(this.detalle_producto.IdGrupoCompra);
        console.log(this.detalle_producto.GrupoCompraName);
        if (
          this.SelectedGrupoComp.IdGrupoCompra === undefined &&
          this.SelectedGrupoComp.Nombre === undefined &&
          this.detalle_producto.IdGrupoCompra === undefined &&
          this.detalle_producto.GrupoCompraName === undefined
        ) {
          console.log("datos dentro del if de grupos de compra");
          this.SelectedGrupoComp.IdGrupoCompra = 0;
          this.SelectedGrupoComp.Nombre = " ";
        } else if (
          this.SelectedGrupoComp.IdGrupoCompra === undefined &&
          this.SelectedGrupoComp.Nombre === undefined &&
          this.detalle_producto.IdGrupoCompra.length != 0 &&
          this.detalle_producto.GrupoCompraName.length != 0
        ) {
          console.log("dentro del else de griupo de compra");
          this.SelectedGrupoComp.IdGrupoCompra =
            this.detalle_producto.IdGrupoCompra;
          this.SelectedGrupoComp.Nombre = this.detalle_producto.GrupoCompraName;
        }

        if (
          this.SelectedUnidadMed.IdUnidadMedida === undefined &&
          this.SelectedUnidadMed.NombreUnidadMedida === undefined &&
          this.detalle_producto.IdUnidadMedida === undefined &&
          this.detalle_producto.MEDIDA === undefined
        ) {
          this.SelectedUnidadMed.IdUnidadMedida = " ";
          this.SelectedUnidadMed.NombreUnidadMedida = " ";
        } else if (
          this.SelectedUnidadMed.IdUnidadMedida === undefined &&
          this.SelectedUnidadMed.NombreUnidadMedida === undefined &&
          this.detalle_producto.IdUnidadMedida.length != 0 &&
          this.detalle_producto.MEDIDA.length != 0
        ) {
          this.SelectedUnidadMed.IdUnidadMedida =
            this.detalle_producto.IdUnidadMedida;
          this.SelectedUnidadMed.NombreUnidadMedida =
            this.detalle_producto.MEDIDA;
        }
        console.log(this.SelectOrdenEstadisitica);
        if (
          this.SelectOrdenEstadisitica.IdOrdenInterna.length === 0 &&
          this.SelectOrdenEstadisitica.NombreOrder.length === 0 &&
          this.detalle_producto.IdOrdenEstadisitica === undefined &&
          this.detalle_producto.OrdenEstadisiticaName === undefined
        ) {
          console.log("datos de orden internaaaaa-----");
          this.SelectOrdenEstadisitica.IdOrdenInterna = " ";
          this.SelectOrdenEstadisitica.NombreOrder = " ";
        } else if (
          this.SelectOrdenEstadisitica.IdOrdenInterna.length === 0 &&
          this.SelectOrdenEstadisitica.NombreOrder.length === 0 &&
          this.detalle_producto.IdOrdenEstadisitica.length != 0 &&
          this.detalle_producto.OrdenEstadisiticaName.length != 0
        ) {
          console.log("datos de orden estadistica 2 ------------");
          this.SelectOrdenEstadisitica.IdOrdenInterna =
            this.detalle_producto.IdOrdenEstadisitica;
          this.SelectOrdenEstadisitica.NombreOrder =
            this.detalle_producto.OrdenEstadisiticaName;
        }
        console.log("NUMERO DE ACTIVO   " + this.SelectedNumActivo);
        if (
          this.SelectedNumActivo.IdActivo === undefined &&
          this.SelectedNumActivo.IdActivo === undefined &&
          this.detalle_producto.IdNumeroActivo === undefined &&
          this.detalle_producto.ACTFIJ === undefined
        ) {
          this.SelectedNumActivo.IdActivo = " ";
          this.SelectedNumActivo.Nombre = " ";
        } else if (
          this.SelectedNumActivo.IdActivo === undefined &&
          this.SelectedNumActivo.IdActivo === undefined &&
          this.detalle_producto.IdNumeroActivo != undefined &&
          this.detalle_producto.ACTFIJ != undefined
        ) {
          this.SelectedNumActivo.IdActivo =
            this.detalle_producto.IdNumeroActivo;
          this.SelectedNumActivo.Nombre = this.detalle_producto.ACTFIJ;
        }
        console.log("NUMERO NECESIDAD   " + this.SelectedNecesidad);
        if (
          this.SelectedNecesidad.IdNecesidad === undefined &&
          this.SelectedNecesidad.Nombre === undefined &&
          this.detalle_producto.IdNecesidad === undefined &&
          this.detalle_producto.NumeroNecesidadName.length === 0
        ) {
          this.SelectedNecesidad.IdNecesidad = 0;
          this.SelectedNecesidad.Nombre = " ";
        } else if (
          this.SelectedNecesidad.IdNecesidad === undefined &&
          this.SelectedNecesidad.Nombre === undefined &&
          this.detalle_producto.IdNecesidad != undefined &&
          this.detalle_producto.NumeroNecesidadName.length != 0
        ) {
          this.SelectedNecesidad.IdNecesidad =
            this.detalle_producto.IdNecesidad;
          this.SelectedNecesidad.Nombre =
            this.detalle_producto.NumeroNecesidadName;
        }

        console.log(
          this.precio +
            " -- " +
            this.cantidad +
            " --- " +
            this.Espesificaciones +
            " -- " +
            this.UsoBien +
            "  "
        );
        // console.log(this.SelectedAlmacen);
        // console.log(this.SelectedMaterial);
        // console.log(this.SelectedCentroCost);
        // console.log(this.SelectedCuentaMayor);
        // console.log(this.SelectedGrupoComp);
        // console.log(this.SelectedUnidadMed);
        // console.log(this.SelectOrdenEstadisitica);
        // console.log(this.SelectedNumActivo);
        // console.log(this.SelectedNecesidad);
        //console.log("-------//////  STATUS id" + this.DataSolReg.IdStatusSolicitud);
        var IdSol = this.DataSolReg.ID;
        //realizamos el update de los campos que se requeran, si no tiene ningun valor se llena con el que ya se tien en DB
        this.solicitudComp
          .updateinfoProd(
            IdSol,
            this.detalle_producto.IdProducto,
            this.precio,
            this.cantidad,
            this.SelectedAlmacen.IdAlmacen,
            this.SelectedAlmacen.Nombre,
            this.SelectedMaterial.IdMaterial,
            this.SelectedMaterial.Nombre,
            this.SelectedCentroCost.IdCentroCosto,
            this.SelectedCentroCost.Nombre,
            this.SelectedCuentaMayor.IdCuentaMayor,
            this.SelectedCuentaMayor.Nombre,
            this.SelectedGrupoComp.IdGrupoCompra,
            this.SelectedGrupoComp.Nombre,
            this.SelectedUnidadMed.IdUnidadMedida,
            this.SelectedUnidadMed.NombreUnidadMedida,
            this.SelectOrdenEstadisitica.IdOrdenInterna,
            this.SelectOrdenEstadisitica.NombreOrder,
            this.SelectedNumActivo.IdActivo,
            this.SelectedNumActivo.Nombre,
            this.SelectedNecesidad.IdNecesidad,
            this.SelectedNecesidad.Nombre,
            this.Espesificaciones,
            this.UsoBien,
            this.newStatus
          )
          .subscribe(
            (data) => {
              console.log(data);
              this.precio = 0;
              this.cantidad = 0;
              this.SelectedAlmacen = new Almacen();
              this.SelectedMaterial = new Materiales();
              this.SelectedCentroCost = new CentroCostos();
              this.SelectedCuentaMayor = new CuentaMayor();
              this.SelectedGrupoComp = new GrupoCompra();
              this.SelectedUnidadMed = new UnidadMedida();
              this.SelectOrdenEstadisitica = new OrdenInterna();
              this.SelectedNumActivo = new Activo();
              this.SelectedNecesidad = new Necesidad();
              this.Espesificaciones = "";
              this.UsoBien = "";
              this.toast.setMessage(
                "Puedes seguir editando , datos guardados",
                "sucsess"
              );
              //this.cancelEditing();
            },
            (err) => {
              console.log(err);
              this.precio = 0;
              this.cantidad = 0;
              this.SelectedAlmacen = new Almacen();
              this.SelectedMaterial = new Materiales();
              this.SelectedCentroCost = new CentroCostos();
              this.SelectedCuentaMayor = new CuentaMayor();
              this.SelectedGrupoComp = new GrupoCompra();
              this.SelectedUnidadMed = new UnidadMedida();
              this.SelectOrdenEstadisitica = new OrdenInterna();
              this.SelectedNumActivo = new Activo();
              this.SelectedNecesidad = new Necesidad();
              this.Espesificaciones = "";
              this.UsoBien = "";
              this.toast.setMessage(
                "Error al actualizar en Producto " + err,
                "danger"
              );
            }
          );
      }
    } else if (this.DataSolReg.IdSol === 7) {
      console.log("SERVICIOS CON PRODUCCIONES");
      if (
        // this.precio == undefined || this.precio == 0 &&
        // this.cantidad == undefined || this.cantidad == 0 &&
        this.Espesificaciones === undefined &&
        this.UsoBien === undefined &&
        // this.SelectedAlmacen.IdAlmacen === undefined || this.SelectedAlmacen.IdAlmacen === '' &&
        // this.SelectedAlmacen.Nombre === undefined || this.SelectedAlmacen.Nombre === '' &&
        // this.SelectedMaterial.IdMaterial === undefined || this.SelectedMaterial.IdMaterial === '' &&
        // this.SelectedMaterial.Nombre === undefined || this.SelectedMaterial.Nombre === '' &&
        // this.SelectedCentroCost.IdCentroCosto === undefined || this.SelectedCentroCost.IdCentroCosto === '' &&
        // this.SelectedCentroCost.Nombre === undefined || this.SelectedCentroCost.Nombre === '' &&
        // this.SelectedCuentaMayor.IdCuentaMayor === undefined || this.SelectedCuentaMayor.IdCuentaMayor === '' &&
        // this.SelectedCuentaMayor.Nombre === undefined || this.SelectedCuentaMayor.Nombre === '' &&
        this.SelectedGrupoComp.IdGrupoCompra === undefined &&
        this.SelectedGrupoComp.Nombre === undefined &&
        // this.SelectedUnidadMed.IdUnidadMedida === undefined || this.SelectedUnidadMed.IdUnidadMedida === '' &&
        // this.SelectedUnidadMed.NombreUnidadMedida === undefined || this.SelectedUnidadMed.NombreUnidadMedida === '' &&
        // this.SelectOrdenEstadisitica.IdOrdenInterna === undefined || this.SelectOrdenEstadisitica.IdOrdenInterna === '' &&
        // this.SelectOrdenEstadisitica.NombreOrder === undefined || this.SelectOrdenEstadisitica.NombreOrder === '' &&
        // this.SelectedNumActivo.IdActivo === undefined || this.SelectedNumActivo.IdActivo === '' &&
        // this.SelectedNumActivo.Nombre === undefined || this.SelectedNumActivo.Nombre === '' &&
        this.SelectedNecesidad.IdNecesidad === undefined &&
        this.SelectedNecesidad.Nombre === undefined
      ) {
        this.toast.setMessage(
          "si se requiere actualizar un producto, se debe de llenar almenos un campo o seleccionar una opcion",
          "warning"
        );
      } else {
        console.log("dentro del ELSE");
        if (this.precio == undefined) {
          this.precio = this.detalle_producto.Precio;
          //this.priceS = this.detalle_producto.PRECIO.toString();
        }
        if (this.cantidad == undefined) {
          this.cantidad = this.detalle_producto.CANTIDAD;
        }
        if (this.Espesificaciones == undefined) {
          this.Espesificaciones = this.detalle_producto.EspGenerales;
        }
        if (this.UsoBien == undefined) {
          this.UsoBien = this.detalle_producto.BIENOSERV;
        }
        //console.log(this.SelectedAlmacen+"------"+this.detalle_producto.IdAlmacen.count + "   " + this.detalle_producto.AlmacenName.count);
        if (
          (this.SelectedAlmacen === undefined &&
            this.detalle_producto.IdAlmacen === undefined) ||
          (this.detalle_producto.IdAlmacen === null &&
            this.detalle_producto.AlmacenName === undefined) ||
          this.detalle_producto.AlmacenName === null
        ) {
          this.SelectedAlmacen.IdAlmacen = " ";
          this.SelectedAlmacen.Nombre = " ";
        } else {
          this.SelectedAlmacen.IdAlmacen = this.detalle_producto.IdAlmacen;
          this.SelectedAlmacen.Nombre = this.detalle_producto.AlmacenName;
        }

        if (
          (this.SelectedMaterial === undefined &&
            this.detalle_producto.IdMaterial === undefined) ||
          (this.detalle_producto.IdMaterial === null &&
            this.detalle_producto.MaterialName === undefined) ||
          this.detalle_producto.MaterialName === null
        ) {
          this.SelectedMaterial.IdMaterial = " ";
          this.SelectedMaterial.Nombre = " ";
        } else {
          this.SelectedMaterial.IdMaterial = this.detalle_producto.IdMaterial;
          this.SelectedMaterial.Nombre = this.detalle_producto.MaterialName;
        }

        if (
          this.SelectedCentroCost.IdCentroCosto.length === 0 &&
          this.SelectedCentroCost.Nombre.length === undefined &&
          this.detalle_producto.IdCentroCostos === undefined &&
          this.detalle_producto.CECO.length === 0
        ) {
          console.log("dentro del if");
          this.SelectedCentroCost.IdCentroCosto = " ";
          this.SelectedCentroCost.Nombre = " ";
        } else if (
          this.SelectedCentroCost.IdCentroCosto.length === 0 &&
          this.SelectedCentroCost.Nombre.length === 0 &&
          this.detalle_producto.IdCentroCostos != undefined &&
          this.detalle_producto.CECO != undefined
        ) {
          console.log("dentro del else if");
          this.SelectedCentroCost.IdCentroCosto =
            this.detalle_producto.IdCentroCostos;
          this.SelectedCentroCost.Nombre = this.detalle_producto.CECO;
        } else {
          console.log("se tomaran los valores del select");
        }
        if (
          this.SelectedCuentaMayor.IdCuentaMayor.length === 0 &&
          this.SelectedCuentaMayor.Nombre.length === 0 &&
          this.detalle_producto.IdCuentaMayor === undefined &&
          this.detalle_producto.CMAYOR === undefined
        ) {
          this.SelectedCuentaMayor.IdCuentaMayor = " ";
          this.SelectedCuentaMayor.Nombre = " ";
        } else if (
          this.SelectedCuentaMayor.IdCuentaMayor.length === 0 &&
          this.SelectedCuentaMayor.Nombre.length === 0 &&
          this.detalle_producto.IdCuentaMayor != undefined &&
          this.detalle_producto.CMAYOR != undefined
        ) {
          this.SelectedCuentaMayor.IdCuentaMayor =
            this.detalle_producto.IdCuentaMayor;
          this.SelectedCuentaMayor.Nombre = this.detalle_producto.CMAYOR;
        }
        console.log("GRUPO DE COMRPA" + this.SelectedGrupoComp);
        console.log(this.detalle_producto.IdGrupoCompra);
        console.log(this.detalle_producto.GrupoCompraName);
        if (
          this.SelectedGrupoComp.IdGrupoCompra === undefined &&
          this.SelectedGrupoComp.Nombre === undefined &&
          this.detalle_producto.IdGrupoCompra.length === 0 &&
          this.detalle_producto.GrupoCompraName.length === 0
        ) {
          console.log("datos dentro del if de grupos de compra");
          this.SelectedGrupoComp.IdGrupoCompra = 0;
          this.SelectedGrupoComp.Nombre = " ";
        } else if (
          this.SelectedGrupoComp.IdGrupoCompra === undefined &&
          this.SelectedGrupoComp.Nombre === undefined &&
          this.detalle_producto.IdGrupoCompra.length != 0 &&
          this.detalle_producto.GrupoCompraName.length != 0
        ) {
          console.log("dentro del else de griupo de compra");
          this.SelectedGrupoComp.IdGrupoCompra =
            this.detalle_producto.IdGrupoCompra;
          this.SelectedGrupoComp.Nombre = this.detalle_producto.GrupoCompraName;
        }

        if (
          this.SelectedUnidadMed.IdUnidadMedida === undefined &&
          this.SelectedUnidadMed.NombreUnidadMedida === undefined &&
          this.detalle_producto.IdUnidadMedida.length === 0 &&
          this.detalle_producto.MEDIDA.length === 0
        ) {
          this.SelectedUnidadMed.IdUnidadMedida = " ";
          this.SelectedUnidadMed.NombreUnidadMedida = " ";
        } else if (
          this.SelectedUnidadMed.IdUnidadMedida === undefined &&
          this.SelectedUnidadMed.NombreUnidadMedida === undefined &&
          this.detalle_producto.IdUnidadMedida.length != 0 &&
          this.detalle_producto.MEDIDA.length != 0
        ) {
          this.SelectedUnidadMed.IdUnidadMedida =
            this.detalle_producto.IdUnidadMedida;
          this.SelectedUnidadMed.NombreUnidadMedida =
            this.detalle_producto.MEDIDA;
        }
        if (
          this.SelectOrdenEstadisitica.IdOrdenInterna.length === 0 &&
          this.SelectOrdenEstadisitica.NombreOrder.length === 0 &&
          this.detalle_producto.IdOrdenEstadisitica === undefined &&
          this.detalle_producto.OrdenEstadisiticaName === undefined
        ) {
          console.log("datos de orden internaaaaa-----");
          this.SelectOrdenEstadisitica.IdOrdenInterna = " ";
          this.SelectOrdenEstadisitica.NombreOrder = " ";
        } else if (
          this.SelectOrdenEstadisitica.IdOrdenInterna.length === 0 &&
          this.SelectOrdenEstadisitica.NombreOrder.length === 0 &&
          this.detalle_producto.IdOrdenEstadisitica.length != 0 &&
          this.detalle_producto.OrdenEstadisiticaName.length != 0
        ) {
          console.log("datos de orden estadistica 2 ------------");
          this.SelectOrdenEstadisitica.IdOrdenInterna =
            this.detalle_producto.IdOrdenEstadisitica;
          this.SelectOrdenEstadisitica.NombreOrder =
            this.detalle_producto.OrdenEstadisiticaName;
        }
        if (
          this.SelectedNumActivo.IdActivo === undefined &&
          this.SelectedNumActivo.IdActivo === undefined &&
          this.detalle_producto.IdNumeroActivo === undefined &&
          this.detalle_producto.ACTFIJ === undefined
        ) {
          this.SelectedNumActivo.IdActivo = " ";
          this.SelectedNumActivo.Nombre = " ";
        } else if (
          this.SelectedNumActivo.IdActivo === undefined &&
          this.SelectedNumActivo.IdActivo === undefined &&
          this.detalle_producto.IdNumeroActivo != undefined &&
          this.detalle_producto.ACTFIJ != undefined
        ) {
          this.SelectedNumActivo.IdActivo =
            this.detalle_producto.IdNumeroActivo;
          this.SelectedNumActivo.Nombre = this.detalle_producto.ACTFIJ;
        }
        if (
          this.SelectedNecesidad.IdNecesidad === undefined &&
          this.SelectedNecesidad.Nombre === undefined &&
          this.detalle_producto.IdNecesidad.length === 0 &&
          this.detalle_producto.NumeroNecesidadName.length === 0
        ) {
          this.SelectedNecesidad.IdNecesidad = 0;
          this.SelectedNecesidad.Nombre = " ";
        } else if (
          this.SelectedNecesidad.IdNecesidad === undefined &&
          this.SelectedNecesidad.Nombre === undefined &&
          this.detalle_producto.IdNecesidad.length != 0 &&
          this.detalle_producto.NumeroNecesidadName.length != 0
        ) {
          this.SelectedNecesidad.IdNecesidad =
            this.detalle_producto.IdNecesidad;
          this.SelectedNecesidad.Nombre =
            this.detalle_producto.NumeroNecesidadName;
        }

        console.log(
          this.precio +
            " -- " +
            this.cantidad +
            " --- " +
            this.Espesificaciones +
            " -- " +
            this.UsoBien +
            "  "
        );
        // console.log(this.SelectedAlmacen);
        // console.log(this.SelectedMaterial);
        // console.log(this.SelectedCentroCost);
        // console.log(this.SelectedCuentaMayor);
        // console.log(this.SelectedGrupoComp);
        // console.log(this.SelectedUnidadMed);
        // console.log(this.SelectOrdenEstadisitica);
        // console.log(this.SelectedNumActivo);
        // console.log(this.SelectedNecesidad);
        //console.log("-------//////  STATUS id" + this.DataSolReg.IdStatusSolicitud);
        var IdSol = this.DataSolReg.ID;
        //realizamos el update de los campos que se requeran, si no tiene ningun valor se llena con el que ya se tien en DB
        this.solicitudComp
          .updateinfoProd(
            IdSol,
            this.detalle_producto.IdProducto,
            this.precio,
            this.cantidad,
            this.SelectedAlmacen.IdAlmacen,
            this.SelectedAlmacen.Nombre,
            this.SelectedMaterial.IdMaterial,
            this.SelectedMaterial.Nombre,
            this.SelectedCentroCost.IdCentroCosto,
            this.SelectedCentroCost.Nombre,
            this.SelectedCuentaMayor.IdCuentaMayor,
            this.SelectedCuentaMayor.Nombre,
            this.SelectedGrupoComp.IdGrupoCompra,
            this.SelectedGrupoComp.Nombre,
            this.SelectedUnidadMed.IdUnidadMedida,
            this.SelectedUnidadMed.NombreUnidadMedida,
            this.SelectOrdenEstadisitica.IdOrdenInterna,
            this.SelectOrdenEstadisitica.NombreOrder,
            this.SelectedNumActivo.IdActivo,
            this.SelectedNumActivo.Nombre,
            this.SelectedNecesidad.IdNecesidad,
            this.SelectedNecesidad.Nombre,
            this.Espesificaciones,
            this.UsoBien,
            this.newStatus
          )
          .subscribe(
            (data) => {
              console.log(data);
              this.precio = 0;
              this.cantidad = 0;
              this.SelectedAlmacen = new Almacen();
              this.SelectedMaterial = new Materiales();
              this.SelectedCentroCost = new CentroCostos();
              this.SelectedCuentaMayor = new CuentaMayor();
              this.SelectedGrupoComp = new GrupoCompra();
              this.SelectedUnidadMed = new UnidadMedida();
              this.SelectOrdenEstadisitica = new OrdenInterna();
              this.SelectedNumActivo = new Activo();
              this.SelectedNecesidad = new Necesidad();
              this.Espesificaciones = "";
              this.UsoBien = "";
              this.toast.setMessage(
                "Puedes seguir editando , datos guardados",
                "sucsess"
              );
              //this.cancelEditing();
            },
            (err) => {
              console.log(err);
              this.precio = 0;
              this.cantidad = 0;
              this.SelectedAlmacen = new Almacen();
              this.SelectedMaterial = new Materiales();
              this.SelectedCentroCost = new CentroCostos();
              this.SelectedCuentaMayor = new CuentaMayor();
              this.SelectedGrupoComp = new GrupoCompra();
              this.SelectedUnidadMed = new UnidadMedida();
              this.SelectOrdenEstadisitica = new OrdenInterna();
              this.SelectedNumActivo = new Activo();
              this.SelectedNecesidad = new Necesidad();
              this.Espesificaciones = "";
              this.UsoBien = "";
              this.toast.setMessage(
                "Error al actualizar el Producto " + err,
                "danger"
              );
            }
          );
      }
    }
  }

  updateLVLChilds() {
    console.log(
      "Dentro del metodo para actualizar los valores de los sub items en DB"
    );
    console.log(this.cantidadchild);
    console.log(this.preciochild);
    console.log(this.SelectOrdenEstadisiticaChild.IdOrdenInterna.length);
    console.log(" Orden Interna " + this.SelectOrdenEstadisiticaChild.NombreOrder.length);
    console.log(this.SelectedCentroCostChild.IdCentroCosto.length +" Centro Cosotos " +this.SelectedCentroCostChild.Nombre.length);
    console.log(
      this.SelectedCuentaMayorChild.IdCuentaMayor.length +
        " CunetaMeyor " +
        this.SelectedCuentaMayorChild.Nombre.length
    );
    console.log(
      this.SelectedUnidadMedChild.IdUnidadMedida +
        " Unidad M " +
        this.SelectedUnidadMedChild.NombreUnidadMedida
    );
    console.log(this.textbreve);

    if (
      
      this.preciochild == 0 &&
        this.SelectOrdenEstadisiticaChild.IdOrdenInterna.length == 0 &&
        this.SelectOrdenEstadisiticaChild.NombreOrder.length == 0 &&
        this.SelectedCentroCostChild.Nombre.length == 0 &&
        this.SelectedCentroCostChild.IdCentroCosto.length == 0 &&
        this.SelectedCuentaMayorChild.IdCuentaMayor.length == 0 &&
        this.SelectedCuentaMayorChild.Nombre.length == 0 &&
        this.SelectedUnidadMedChild.IdUnidadMedida === undefined &&
        this.SelectedUnidadMedChild.NombreUnidadMedida === undefined &&
        this.textbreve === undefined
    ) {
      this.toast.setMessage(
        "si se requiere actualizar un SubProducto, se debe de llenar almenos un campo o seleccionar una opcion",
        "warning"
      );
    } else {
      if (
        this.cantidadchild === 0 ||
        this.cantidadchild === undefined ||
        this.cantidadchild === null
      ) {
        this.cantidadchild = this.detalle_subproducts.CantidadChild;
      }
      if (
        this.preciochild === 0 ||
        this.preciochild === undefined ||
        this.preciochild === null
      ) {
        this.preciochild = this.detalle_subproducts.preciochildnormal;
      }

      console.log(
        "OrdenE-Select->" +
          this.SelectOrdenEstadisiticaChild +
          "OrdenE save-->" +
          this.detalle_subproducts.IdOrdenEstadisticaChild
      );
      if (
        this.SelectOrdenEstadisiticaChild.IdOrdenInterna.length === 0 &&
        this.SelectOrdenEstadisiticaChild.IdOrdenInterna.length === 0 &&
        this.detalle_subproducts.IdOrdenEstadisticaChild === undefined &&
        this.detalle_subproducts.NameOrdenEstadisticaChild === undefined
      ) {
        this.SelectOrdenEstadisiticaChild.IdOrdenInterna = " ";
        this.SelectOrdenEstadisiticaChild.NombreOrder = " ";
      } else if (
        this.SelectOrdenEstadisiticaChild.IdOrdenInterna.length === 0 &&
        this.SelectOrdenEstadisiticaChild.IdOrdenInterna.length === 0 &&
        this.detalle_subproducts.IdOrdenEstadisticaChild != undefined &&
        this.detalle_subproducts.NameOrdenEstadisticaChild != undefined
      ) {
        this.SelectOrdenEstadisiticaChild.IdOrdenInterna =
          this.detalle_subproducts.IdOrdenEstadisticaChild;
        this.SelectOrdenEstadisiticaChild.NombreOrder =
          this.detalle_subproducts.NameOrdenEstadisticaChild;
      } else {
        console.log(
          "deberia de tomar los valores que se seleccionaron de Orden Estadisitica ****"
        );
      }

      console.log(
        "CentroCotos-Selected->" +
          this.SelectedCentroCostChild +
          " CeCO save--> " +
          this.detalle_subproducts.IdCentoCostoChild
      );
      if (
        this.SelectedCentroCostChild.IdCentroCosto.length === 0 &&
        this.SelectedCentroCostChild.Nombre.length === 0 &&
        this.detalle_subproducts.IdCentoCostoChild.length === 0 &&
        this.detalle_subproducts.NameCentroCostoChild.length === 0
      ) {
        console.log("dentro del if de centro de costos ");
        this.SelectedCentroCostChild.IdCentroCosto = " ";
        this.SelectedCentroCostChild.Nombre = " ";
      } else if (
        this.SelectedCentroCostChild.IdCentroCosto.length === 0 &&
        this.SelectedCentroCostChild.Nombre.length === 0 &&
        this.detalle_subproducts.IdCentoCostoChild != undefined &&
        this.detalle_subproducts.NameCentroCostoChild != undefined
      ) {
        console.log("dentro del else if de centro de cosotos ");
        this.SelectedCentroCostChild.IdCentroCosto =
          this.detalle_subproducts.IdCentoCostoChild;
        this.SelectedCentroCostChild.Nombre =
          this.detalle_subproducts.NameCentroCostoChild;
      } else {
        console.log(
          "Se deben de tomar los datos seleccionado de Centro de Costos"
        );
      }

      if (
        this.SelectedCuentaMayorChild.IdCuentaMayor.length === 0 &&
        this.SelectedCuentaMayorChild.Nombre.length === 0 &&
        this.detalle_subproducts.IdCuentaMayorChild === undefined &&
        this.detalle_subproducts.NameCuentaMayorChild === undefined
      ) {
        console.log("dento del if de cuenta de mayor");
        this.SelectedCuentaMayorChild.IdCuentaMayor = " ";
        this.SelectedCuentaMayorChild.Nombre = " ";
      } else if (
        this.SelectedCuentaMayorChild.IdCuentaMayor.length === 0 &&
        this.SelectedCuentaMayorChild.Nombre.length === 0 &&
        this.detalle_subproducts.IdCuentaMayorChild != undefined &&
        this.detalle_subproducts.NameCuentaMayorChild != undefined
      ) {
        console.log("dentro del else if de cuenta de mayor ");
        this.SelectedCuentaMayorChild.IdCuentaMayor =
          this.detalle_subproducts.IdCuentaMayorChild;
        this.SelectedCuentaMayorChild.Nombre =
          this.detalle_subproducts.NameCuentaMayorChild;
      } else {
        console.log("Se tomand los datos seleccionados de Cuneta de mayor");
      }
      console.log(
        "datos guardados UM-->" +
          this.detalle_subproducts.IdUnidadMedidaChild +
          "---" +
          this.detalle_subproducts.NameUnidadMedidaChild +
          "--- Datos Select--" +
          this.SelectedUnidadMedChild
      );
      if (
        this.SelectedUnidadMedChild.IdUnidadMedida === undefined &&
        this.SelectedUnidadMedChild.NombreUnidadMedida === undefined &&
        this.detalle_subproducts.IdUnidadMedidaChild === undefined &&
        this.detalle_subproducts.NameUnidadMedidaChild === undefined
      ) {
        console.log("dentro del if de unidad de medida");
        this.SelectedUnidadMedChild.IdUnidadMedida = " ";
        this.SelectedUnidadMedChild.NombreUnidadMedida = " ";
      } else if (
        this.SelectedUnidadMedChild.IdUnidadMedida === undefined &&
        this.SelectedUnidadMedChild.NombreUnidadMedida === undefined &&
        this.detalle_subproducts.IdUnidadMedidaChild != undefined &&
        this.detalle_subproducts.NameUnidadMedidaChild != undefined
      ) {
        console.log("dentro del else if de unidad de medida");
        this.SelectedUnidadMedChild.IdUnidadMedida =
          this.detalle_subproducts.IdUnidadMedidaChild;
        this.SelectedUnidadMedChild.NombreUnidadMedida =
          this.detalle_subproducts.NameUnidadMedidaChild;
      } else {
        console.log("Se deben de tomar los datos de Unidad de medida");
      }

      if (this.textbreve === undefined || this.textbreve.length === 0) {
        this.textbreve = this.detalle_subproducts.TextoBreve;
      }
      console.log("************************¨¨¨¨¨¨¨¨¨¨*********************");
      console.log(this.cantidadchild);
      console.log(this.preciochild);
      console.log(
        "OESTADIS " +
          this.SelectOrdenEstadisiticaChild.IdOrdenInterna +
          "  " +
          this.SelectOrdenEstadisiticaChild.NombreOrder
      );
      console.log(
        this.SelectedCentroCostChild.IdCentroCosto +
          "  " +
          this.SelectedCentroCostChild.Nombre
      );
      console.log(
        this.SelectedCuentaMayorChild.IdCuentaMayor +
          "  " +
          this.SelectedCuentaMayorChild.Nombre
      );
      console.log(
        this.SelectedUnidadMedChild.IdUnidadMedida +
          "  " +
          this.SelectedUnidadMedChild.NombreUnidadMedida
      );
      console.log(this.textbreve);

      //console.log("-------//////  STATUS id" + this.DataSolReg.IdStatusSolicitud);

      var IdSol = this.DataSolReg.ID;

      /* realizamos el Update de los datos a actualizar para los subproductos.*/
      this.solicitudComp
        .updateinfoChilds(
          IdSol,
          this.detalle_subproducts.IdSubProducto,
          this.preciochild,
          this.cantidadchild,
          this.SelectOrdenEstadisiticaChild.IdOrdenInterna,
          this.SelectOrdenEstadisiticaChild.NombreOrder,
          this.SelectedCentroCostChild.IdCentroCosto,
          this.SelectedCentroCostChild.Nombre,
          this.SelectedCuentaMayorChild.IdCuentaMayor,
          this.SelectedCuentaMayorChild.Nombre,
          this.SelectedUnidadMedChild.IdUnidadMedida,
          this.SelectedUnidadMedChild.NombreUnidadMedida,
          this.textbreve,
          this.newStatus
        )
        .subscribe(
          (data) => {
            console.log(data);
            this.cantidadchild = 0;
            this.preciochild = 0;
            this.SelectOrdenEstadisiticaChild.IdOrdenInterna = "";
            this.SelectOrdenEstadisiticaChild.NombreOrder = "";
            this.SelectedCentroCostChild.IdCentroCosto = "";
            this.SelectedCentroCostChild.Nombre = "";
            this.SelectedCuentaMayorChild.IdCuentaMayor = "";
            this.SelectedCuentaMayorChild.Nombre = "";
            this.SelectedUnidadMedChild.IdUnidadMedida = "";
            this.SelectedUnidadMedChild.NombreUnidadMedida = "";
            this.textbreve = "";
            this.iseditsubProduct = false;
            this.closeViewChilds();
            this.toast.setMessage(
              "Puedes seguir editando , datos guardados",
              "success"
            );
            //this.cancelEditing();
          },
          (error) => {
            if (error.status == 403 || error.status == 404) {
              this.toast.setMessage(error.message, "danger");
              this.auth.logout();
            }
            console.log(error);
            this.cantidadchild = 0;
            this.preciochild = 0;
            this.SelectOrdenEstadisiticaChild.IdOrdenInterna = "";
            this.SelectOrdenEstadisiticaChild.NombreOrder = "";
            this.SelectedCentroCostChild.IdCentroCosto = "";
            this.SelectedCentroCostChild.Nombre = "";
            this.SelectedCuentaMayorChild.IdCuentaMayor = "";
            this.SelectedCuentaMayorChild.Nombre = "";
            this.SelectedUnidadMedChild.IdUnidadMedida = "";
            this.SelectedUnidadMedChild.NombreUnidadMedida = "";
            this.textbreve = "";
            this.iseditsubProduct = false;
            this.toast.setMessage(
              "Error al actualizar los SubConceptos" + error,
              "danger"
            );
          }
        );
    }
  }

  async ChecknextStatus(IdUser: number) {
    console.log("dentro del metodo para checar el estatus");
    let retunrvalue;
    const exceptAuthException = await this.solicitudComp.getRoleExcepcionDir(IdUser);
    console.log(exceptAuthException)
    if (
      this.DataSolReg.IdStatusSolicitud === 3 && exceptAuthException === 3 ||
      exceptAuthException == 0 ||
      exceptAuthException == undefined
    ) {
      //si el a excluir es null o vacio o igual a 3 que es el de Direccion se debe retornar un role 1 (nueva solicitud)
      //para que el gerente de area pueda visualizar la solicitud en su bandeja DENTRO DE LA INTRANET
      console.log("primer if");
      retunrvalue = 1;
      return retunrvalue;
    } else if (this.DataSolReg.IdStatusSolicitud === 3 && exceptAuthException == 2) {
      //si entra en este if quiere decir que el role excluido es el del gerente por lo que se tiene retornar con un estatus 2 (autorizado por gerente)
      //para que lo puedea visualizar el director de area DENTRO DE LA INTRANET
      console.log("2 if");
      retunrvalue = 2
      return retunrvalue;
    } else if (
      this.DataSolReg.IdStatusSolicitud === 5 && exceptAuthException == 3 ||
      exceptAuthException == 0 ||
      exceptAuthException == undefined
    ) {
      console.log("3 if");
        retunrvalue = 1;
       return retunrvalue;
    } else if (this.DataSolReg.IdStatusSolicitud === 5 && exceptAuthException == 2) {
      console.log("4 if");
      retunrvalue = 2;
      return retunrvalue;
    } else if (
      this.DataSolReg.IdStatusSolicitud === 5 && exceptAuthException == 3 ||
      exceptAuthException == 0 ||
      exceptAuthException == undefined
    ) {
      console.log("5 if");
      retunrvalue =1;
      return retunrvalue;
    } else if (this.DataSolReg.IdStatusSolicitud === 7 && exceptAuthException == 2) {
      console.log("5 if");
      retunrvalue = 2
      return retunrvalue;
    }
  }


  openDialog(typeUpdate: number) {
    const dialogRef = this.dialog.open(DialogAdvertenciaUpdateSolpedidoComponent, {
      width: "450px",
      data:typeUpdate
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      console.log("The dialog was closed");
      console.log(result);
      console.log(typeUpdate)
      if (typeUpdate === 0) {
        //esta opcion manda a llamar a meotodo update a nivel datos generales
        try {
          const valReturnStatus = await this.ChecknextStatus(this.auth.currentUser.IdUsuario);
          console.log("Variable de retorno  " + valReturnStatus);
          this.newStatus = (result === true ) ? this.newStatus = valReturnStatus : this.newStatus = this.DataSolReg.IdStatusSolicitud;
          console.log("Variable global  " + this.newStatus)
            await this.updateLVLSOlcitud();
            this.openedDataSol = true;
            if(result === true){
              this.EndEditingAndChangedStatus();
            }
          } catch (error) {
            console.log(error);
          }
      } else if (typeUpdate === 1) {
        //manda a llamar metodo par actualizar datos de producto
        try {
          const valReturnStatus = await this.ChecknextStatus(this.auth.currentUser.IdUsuario);
          console.log("Variable de retorno  " + valReturnStatus);
          this.newStatus = (result === true ) ? this.newStatus = valReturnStatus : this.newStatus = this.DataSolReg.IdStatusSolicitud;
          console.log("Variable global  " + this.newStatus)
          await this.UpdateLVLProducts();
          this.iseditproduct = false;
            if(result === true){
              this.EndEditingAndChangedStatus();
            }
        } catch (error) {
          console.log(error);
        }
      } else if (typeUpdate === 2) {
        //madna a llamar metodo para actualizar datos de subprodcuto
        try {
          const valReturnStatus = await this.ChecknextStatus(this.auth.currentUser.IdUsuario);
          console.log("Variable de retorno  " + valReturnStatus);
          this.newStatus = (result === true ) ? this.newStatus = valReturnStatus : this.newStatus = this.DataSolReg.IdStatusSolicitud;
          console.log("Variable global  " + this.newStatus)
          await this.updateLVLChilds();
            this.iseditsubProduct = false;
            if(result === true){
              this.EndEditingAndChangedStatus();
            }
          } catch (error) {
            console.log(error);
          }
      }
    });
  }

  GeneraPDF(datapdf: SolicitudesCompraRegistradas) {
    console.log(
      "Dentro de el metodo para generar el PDF de la Solicitud de Compra"
    );
    var logo =
      "data:image/png;base64,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";

    var firma =
      "data:image/png;base64,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";
    var firma2 =
      "data:image/png;base64,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";

    ("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");
    let doc = new jsPDF({
      orientation: "portrait",
      format: "letter",
    });

    doc.setFont("Bold", "Calibri");
    doc.setFontSize(10);
    doc.rect(8, 10, 200, 260, "S");

    doc.rect(50, 16, 115, 8, "S");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text(82, 22, "Solicitu de Compra");

    doc.addImage(logo, "PNG", 170, 11, 20, 20);
    doc.addImage(logo, "PNG", 18, 11, 20, 20);

    doc.setFontSize(10);
    doc.text(147, 39, "Fecha de Creacion: ");
    //doc.text(169, 39, '___________');
    doc.text(175, 39, datapdf.FECHASOLICITUD);

    doc.setFontSize(10);
    doc.text(15, 50, "Usuario Solicitante: ");
    //doc.text(38,50,'_____________________');
    doc.setFontSize(9);
    doc.text(44, 50, datapdf.REQUIRENTE);

    doc.setFontSize(10);
    doc.text(80, 50, "Correo Institucional: ");
    //doc.text(94, 50, "_____________________");
    doc.setFontSize(9);
    doc.text(110, 50, "ejemplo12345@gimm.com.mx");

    doc.setFontSize(10);
    doc.text(153, 50, "Numero Telefonico: ");
    doc.setFontSize(9);
    doc.text(182, 50, "5502020202");

    doc.setFontSize(10);
    doc.text(15, 58, "Extencion: ");
    doc.setFontSize(9);
    doc.text(31, 58, "4545");

    doc.setFontSize(10);
    doc.text(40, 58, "Puesto del Solicitante: ");
    doc.setFontSize(9);
    doc.text(72, 58, "Desarrollador");

    doc.setFontSize(10);
    doc.text(118, 58, "C. C : ");
    //doc.text(91, 58,"_______________");
    doc.setFontSize(9);
    doc.text(127, 58, "C00105015A");

    doc.setFontSize(10);
    doc.text(149, 58, "Nombre de la Produccion: ");
    doc.setFontSize(9);
    doc.text(187, 58, "Sale el Sol");

    doc.text(15, 66, "Empresa que compra Bien o Servicio: ");
    //doc.text(53, 75, "___________________________________");
    doc.setFontSize(6);
    doc.text(64, 66, "IMAGEN MONTERREY, S.A. DE C.V.");

    doc.setFontSize(8);
    doc.text(15, 74, "Plaza:");
    //doc.text(106, 75, "__________________________________________________________________________");
    doc.setFontSize(6);
    doc.text(
      23,
      74,
      "CELAYA, GUANAJUATO, IRAPUATO, SALAMANCA, GTO.; CD.  HIDALGO Y MORELIA, MICH.; QUERÉTARO, QRO."
    );

    doc.setFontSize(8);
    doc.text(137, 74, "Cta. Mayor : ");
    //doc.text(27, 83, "_______________");
    doc.text(152, 74, "XXXXXXXXX");
    //comienzo de la tabla
    //Esta es la cabecera de la tabla
    doc.rect(15, 97, 7, 5, "S");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text(18, 100, "#");

    doc.rect(22, 97, 41, 5, "S");
    doc.setTextColor(0, 0, 0);
    doc.text(35, 100, "Bien o Servicio");

    doc.rect(63, 97, 25, 5, "S");
    doc.setTextColor(0, 0, 0);
    doc.text(64, 100, "Cantidad Solicitada");

    doc.rect(88, 97, 24, 5, "S");
    doc.setTextColor(0, 0, 0);
    doc.text(89, 100, "Unidad de Medida");

    doc.rect(112, 97, 43, 5, "S");
    doc.setTextColor(0, 0, 0);
    doc.text(120, 100, "Espf. Gral./Tecnicas");

    doc.rect(155, 97, 45, 5, "S");
    doc.setTextColor(0, 0, 0);
    doc.text(167, 100, "Uso de Bien o Serv.");
    //aqui empieza la numeracion con los campos (1)
    doc.setFontSize(8);
    doc.rect(15, 102, 7, 12, "S");
    doc.setTextColor(0, 0, 0);
    doc.text(18, 109, "1");

    doc.rect(22, 102, 41, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(63, 102, 25, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(88, 102, 24, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(112, 102, 43, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(155, 102, 45, 12, "S");
    doc.setTextColor(0, 0, 0);
    //comienza el numero (2)
    doc.rect(15, 114, 7, 12, "S");
    doc.setTextColor(0, 0, 0);
    doc.text(18, 121, "2");

    doc.rect(22, 114, 41, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(63, 114, 25, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(88, 114, 24, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(112, 114, 43, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(155, 114, 45, 12, "S");
    doc.setTextColor(0, 0, 0);
    //comienza el numero (3)
    doc.rect(15, 126, 7, 12, "S");
    doc.setTextColor(0, 0, 0);
    doc.text(18, 133, "3");

    doc.rect(22, 126, 41, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(63, 126, 25, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(88, 126, 24, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(112, 126, 43, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(155, 126, 45, 12, "S");
    doc.setTextColor(0, 0, 0);
    //comienza el numero (4)
    doc.rect(15, 138, 7, 12, "S");
    doc.setTextColor(0, 0, 0);
    doc.text(18, 145, "4");

    doc.rect(22, 138, 41, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(63, 138, 25, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(88, 138, 24, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(112, 138, 43, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(155, 138, 45, 12, "S");
    doc.setTextColor(0, 0, 0);
    //comienza el numero (5)
    doc.rect(15, 150, 7, 12, "S");
    doc.setTextColor(0, 0, 0);
    doc.text(18, 157, "5");

    doc.rect(22, 150, 41, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(63, 150, 25, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(88, 150, 24, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(112, 150, 43, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(155, 150, 45, 12, "S");
    doc.setTextColor(0, 0, 0);
    //comienza el numero (6)
    doc.rect(15, 162, 7, 12, "S");
    doc.setTextColor(0, 0, 0);
    doc.text(18, 169, "6");

    doc.rect(22, 162, 41, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(63, 162, 25, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(88, 162, 24, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(112, 162, 43, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(155, 162, 45, 12, "S");
    doc.setTextColor(0, 0, 0);
    //comienza el numero (7)
    doc.rect(15, 174, 7, 12, "S");
    doc.setTextColor(0, 0, 0);
    doc.text(18, 181, "7");

    doc.rect(22, 174, 41, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(63, 174, 25, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(88, 174, 24, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(112, 174, 43, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(155, 174, 45, 12, "S");
    doc.setTextColor(0, 0, 0);
    //comienza el numero (8)
    doc.rect(15, 186, 7, 12, "S");
    doc.setTextColor(0, 0, 0);
    doc.text(18, 193, "8");

    doc.rect(22, 186, 41, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(63, 186, 25, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(88, 186, 24, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(112, 186, 43, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(155, 186, 45, 12, "S");
    doc.setTextColor(0, 0, 0);
    //comienza el numero (9)
    doc.rect(15, 198, 7, 12, "S");
    doc.setTextColor(0, 0, 0);
    doc.text(18, 205, "9");

    doc.rect(22, 198, 41, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(63, 198, 25, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(88, 198, 24, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(112, 198, 43, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(155, 198, 45, 12, "S");
    doc.setTextColor(0, 0, 0);
    //cmoienza el numero (10)
    doc.rect(15, 210, 7, 12, "S");
    doc.setTextColor(0, 0, 0);
    doc.text(17, 216, "10");

    doc.rect(22, 210, 41, 12, "S");
    doc.setTextColor(0, 0, 0);
    doc.text(23, 214, "Este es un texto ejemplo......");
    doc.text(23, 217, "Este es otro texto Ejemplo");
    doc.text(23, 220, "Mas texto ejempl");

    doc.rect(63, 210, 25, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(88, 210, 24, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(112, 210, 43, 12, "S");
    doc.setTextColor(0, 0, 0);

    doc.rect(155, 210, 45, 12, "S");
    doc.setTextColor(0, 0, 0);
    //fin

    doc.rect(15, 235, 75, 33, "S");
    doc.setTextColor(0, 0, 0);
    doc.addImage(firma, "PNG", 45, 237, 15, 15);
    doc.setFontSize(7);
    doc.setFont("Bold", "Calibri");
    doc.text(21, 256, "SANDRA CHAVEZ DIAZ");
    doc.text(21, 260, "GERENTE DE INTELIGENCIA DE NEGOCIOS");
    doc.text(28, 267, "Nombre, puesto y firma del Usuario Solicitante");

    doc.rect(125, 235, 75, 33, "S");
    doc.setTextColor(0, 0, 0);
    doc.addImage(firma2, "PNG", 155, 237, 15, 15);
    doc.text(130, 256, "ALEJANDRO CORONADO NAVA");
    doc.text(130, 260, "SUBDIRECTOR DE INTELIGENCA DE NEGOCIOS Y GESTION");
    doc.setFontSize(7);
    doc.text(145, 264, "Nombre, puesto y firma del Director");
    doc.text(138, 267, 'que "autoriza" la compra de los bienes o servicios');

    doc.save("Ejemplo" + ".pdf");
  }
}

