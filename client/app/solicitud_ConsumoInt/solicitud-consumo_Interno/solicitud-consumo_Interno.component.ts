import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ReplaySubject, Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
//auht
import { AuthServices } from "../../services/auth.service";
//models
import { Empresa } from "../../shared/models/empresa.model";
import { SucursalPlaza } from "../../shared/models/sucursalplaza.model";
import { Almacen } from "../../shared/models/almacen.model";
import { Materiales } from "../../shared/models/materiales.model";
import { CentroCostos } from "../../shared/models/centrocostos.model";
import { CuentaMayor } from "../../shared/models/cuentamayor.model";
import { UnidadMedida } from "../../shared/models/umedida.model";
import { CentrosConsumoInt } from "../../shared/models/centrosconsumoint.model";
import { CaducidadConsumoInt } from "../../shared/models/caducidadconsumoint.model";
import { ProductoConsumoInterno } from "../../shared/models/productosconsumointerno.model";
import { SolicitudCompraService } from "../../services/solicitudcompra.service";
import { SolicitudConsumoService } from "../../services/solicitudconsumo.service";
import { SolicitudCompras } from "../../shared/models/solicitudCompras.model";
import { SolicitudConsumoInterno } from "../../shared/models/sol_consum_int.model";
import { ToastComponent } from "../../shared/toast/toast.component";
import { errorMonitor } from "events";
import { Area } from "client/app/shared/models/areas.model";

@Component({
  selector: "app-solicitud-consumo_Interno",
  templateUrl: "./solicitud-consumo_Interno.component.html",
  styleUrls: ["./solicitud-consumo_Interno.component.css"],
})
export class SolicitudConsumo_Interno implements OnInit {
  DataConsumInt: SolicitudConsumoInterno | undefined;
  ProductConsumInt: ProductoConsumoInterno = new ProductoConsumoInterno();
  Date = new FormControl(new Date().toISOString());
  Fecha: string = new Date().toISOString();
  BloqCentro: boolean = false;
  ListAreas: Area[];
  // Variables para hacer filtrado de la Empresa
  /** list of banks */
  protected ListEmpresa: Empresa[];
  /** control for the selected bank */
  public EmpresaCtrl: FormControl = new FormControl();
  /** control for the MatSelect filter keyword */
  public EmpreFilterCtrl: FormControl = new FormControl();
  /** list of banks filtered by search keyword */
  public filteredEmpresa: ReplaySubject<Empresa[]> = new ReplaySubject<
    Empresa[]
  >(1);
  //fin filtrado empresa

   //variables para hacer busquedas por CENTRO
   protected ListCentros: CentrosConsumoInt[];
   public CentroCtrl: FormControl = new FormControl();
   public CentroFilterCtr: FormControl = new FormControl();
   public filteredCentro: ReplaySubject<CentrosConsumoInt[]> = new ReplaySubject<CentrosConsumoInt[]>(1);

  //variables para hacer busquedas por Almacen
  protected ListAlmacen: Almacen[];
  public AlmacenCrtl: FormControl = new FormControl();
  public AlmacenFilterCtrl: FormControl = new FormControl();
  public filteredAlmacen: ReplaySubject<Almacen[]> = new ReplaySubject<Almacen[]>(1);
  //fin de variables

  //variable spara hacer busqueda de Material o Servicio
  protected ListMateriales: Materiales[];
  public MaterialesCtrl: FormControl = new FormControl();
  public MaterialesFilterCtrl: FormControl = new FormControl();
  public filteredMaterial: ReplaySubject<Materiales[]> = new ReplaySubject<Materiales[]>(1);
  //fin de variables material o servicio

  //variables para Hacer Bsuqeudas en Select de Centro de Costos
  protected ListCCostos: CentroCostos[];
  public CCostosCrtl: FormControl = new FormControl();
  public CCosotosFilterCtrl: FormControl = new FormControl();
  public filteredCCostos: ReplaySubject<CentroCostos[]> = new ReplaySubject<CentroCostos[]>(1);
  //public filterCCostosName: ReplaySubject<CentroCostos[]> = new ReplaySubject<CentroCostos[]>(1);
  //fin de variables

  //variables para hacer busqueda en select de la Cuenta de Mayor
  protected ListCmayor: CuentaMayor[];
  public CMayorCtrl: FormControl = new FormControl();
  public CMayorFilterCtrl: FormControl = new FormControl();
  public filteredCMayor: ReplaySubject<CuentaMayor[]> = new ReplaySubject<CuentaMayor[]>(1);
  //fin de las variables

  //variables para hacer busqueda en select en la Unidad
  public ListCaducidad: CaducidadConsumoInt[] = [];
  public CADUCIDAD: CaducidadConsumoInt = new CaducidadConsumoInt();
  public CaducidadCtrl: FormControl = new FormControl();
  public CaducidadFilterCtrl: FormControl = new FormControl();
  public filteredCaducidad: ReplaySubject<CaducidadConsumoInt[]> = new ReplaySubject<CaducidadConsumoInt[]>(1);
  //fin de las varibales unidad

  //variables para hacer busqueda en select de unidadesde medida
  protected ListUnidadMedida: UnidadMedida[];
  public UnidadMedidaCtrl: FormControl = new FormControl();
  public UnidadMedidaFilterCtrl: FormControl = new FormControl();
  public filteredUnidadMedida: ReplaySubject<UnidadMedida[]> = new ReplaySubject<UnidadMedida[]>(1);
  //fin de variables

  protected _onDestroy = new Subject<void>();
  constructor(
    private _snackBar: MatSnackBar,
    private solconsumoserv: SolicitudConsumoService,
    private solicitudComp: SolicitudCompraService,
    public toast: ToastComponent,
    public auth: AuthServices
  ) {}

  ngOnInit() {
    this.DataConsumInt = new SolicitudConsumoInterno();
    this.getAllEmpre();
    this.selectedFecha();
    this.getAreas();
    console.log(this.auth.currentUser);
    this.DataConsumInt.IdUserSolicitante = this.auth.currentUser.IdUsuario;
    this.DataConsumInt.IdRole = this.auth.currentUser.IdRole;
  }

  selectedFecha() {
    var time = new Date();
    var date = new Date();
    var FechaSelect = date.toLocaleDateString();
    var day = date.getDate();
    var mo = date.getUTCMonth();
    var mont = mo + 1;
    var year = date.getFullYear();
    // console.log(day);
    // console.log(mont+1);
    // console.log("---------"+year);
    // console.log(date.getUTCMonth());
    // console.log(mont.toLocaleString());
    var FechaConHora = time.toLocaleTimeString();
    var fechayhora = year + "-" + mont + "-" + day + " " + FechaConHora;
    //console.log(fechayhora);
    this.Fecha = fechayhora;
    this.DataConsumInt.Fecha = this.Fecha;
    //console.log("-------------------------------"+this.Fecha);
  }

  getAreas(){
    this.solconsumoserv.getAreasfoUser(this.auth.currentUser.IdUsuario).subscribe(data=>{
      this.ListAreas = data
    },error=>{
      if(error.status == 403 || error.status == 404){
        this.toast.setMessage(
          error.message,
          "danger"
        );
        this.auth.logout();
      }
      this.toast.setMessage("Error al recuperar las Direcciones, intent un poco mas tarde", "danger")
    })
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
    // console.log("---------------------------");
    // console.log(this.DataConsumInt.Empresa.Bukrs);
    // console.log(this.DataConsumInt.Empresa.Butxt);
    this.getAllCentros(this.DataConsumInt.Empresa.Bukrs);
    this.getAllCuentasMayor(this.DataConsumInt.Empresa);
  }

  getAllCentros(IdEmpresa: number) {
    this.ListCentros = this.solicitudComp.getCentros(IdEmpresa);
    //set initial selection
    this.CentroCtrl.setValue(this.ListCentros[0]);
    // cargar la lista Empresas inicial
    this.filteredCentro.next(this.ListCentros);
    // escuche los cambios en el valor del campo de búsqueda
    this.CentroFilterCtr.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCento();
      });
  }

  protected filterCento() {
    if (!this.ListCentros) {
      return;
    }
    // get the search keyword
    let search = this.CentroFilterCtr.value;
    if (!search) {
      console.log(search);
      this.filteredCentro.next(this.ListCentros.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCentro.next(
      this.ListCentros.filter(
        (empre) => empre.IdCentro.toLowerCase().indexOf(search) > -1
      )
    );
  }

  selectedCentro() {
    console.log(this.DataConsumInt.Centro.IdCentro);
    this.getAllAlmacen(this.DataConsumInt.Centro);
    this.getAllCentroCosto(
      this.DataConsumInt.Empresa,
      this.DataConsumInt.Centro
    );
  }

  getAllAlmacen(Centro: CentrosConsumoInt) {
    this.ListAlmacen = this.solicitudComp.getAllAlmacenConsumoInt(
      Centro.IdCentro
    );
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

  selectedAlmacen() {
    //console.log("Este es el id de el almacen con FormControl----->" + this.Almacen.value);
    //console.log("NgModel--->" + this.DataConsumInt.Almacen.IdAlmacen + "------" + this.DataConsumInt.Almacen.IdAlmacen );
    //var idAlmacen : any = this.DataConsumInt.Almacen.IdAlmacen;
    //var namealmacen : any = this.DataConsumInt.Almacen.Nombre
    //this.Producto.Almacen = idAlmacen;
    //this.Producto.AlmacenName = namealmacen;
    this.ProductConsumInt.Almacen = this.DataConsumInt.Almacen.IdAlmacen;
    this.ProductConsumInt.AlmacenName = this.DataConsumInt.Almacen.Nombre;
    this.getAllMateriales(
      this.DataConsumInt.Centro,
      this.DataConsumInt.Almacen
    );
  }

  getAllMateriales(IdCentro: CentrosConsumoInt, IdAlmacen: Almacen) {
    this.ListMateriales = this.solicitudComp.getAllmaterialesConsumoInt(
      IdCentro,
      IdAlmacen
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

  SelectMat() {
    //console.log("pasamos la info de un NGmodel a el FORM -->" + this.DataInsert.Materiales.IdMaterial + "-------" + this.DataInsert.Materiales.Nombre);
    this.ListCaducidad = [];
    this.ProductConsumInt.Material = this.DataConsumInt.Materiales.IdMaterial;
    this.ProductConsumInt.MaterialName = this.DataConsumInt.Materiales.Nombre;
    this.getunidadMedida(this.DataConsumInt.Materiales.IdMaterial);
    this.getCaducidad(
      this.DataConsumInt.Almacen,
      this.DataConsumInt.Materiales,
      this.DataConsumInt.Centro
    );
  }

  getAllCentroCosto(IdEmpresa: Empresa, IdCentro: CentrosConsumoInt) {
    //console.log("Centro de Costos--->>" + IdEmpresa.Bukrs + "     " + IdCentro.NombreCentro);
    this.ListCCostos = this.solicitudComp.getCentoCostoConsumiInterno(
      IdEmpresa,
      IdCentro.IdCentro
    );
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
    //console.log(search)
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
    this.ProductConsumInt.CentroCosto = this.DataConsumInt.CentroCostos.IdCentroCosto;
    this.ProductConsumInt.CentroCostoName = this.DataConsumInt.CentroCostos.Nombre;
  }

  getAllCuentasMayor(IdEmpresa: Empresa) {
    this.ListCmayor = this.solicitudComp.getCuentaMayor(IdEmpresa, " ");
    this.CMayorCtrl.setValue(this.ListCmayor[0]);
    this.filteredCMayor.next(this.ListCmayor);
    this.CMayorFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCmayor();
      });
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
    this.ProductConsumInt.CuentaMayor = this.DataConsumInt.Cuentamayor.IdCuentaMayor;
    this.ProductConsumInt.CuentaMayorName = this.DataConsumInt.Cuentamayor.Nombre;
    // this.SelectedCMayor = this.DataConsumInt.Cuentamayor;
    // this.Producto.CuentaMayor = IdCMayor;
    // this.Producto.CuentaMayorName = CMayorName;
    // console.log(this.DataConsumInt.Cuentamayor.IdCuentaMayor);
    // console.log(this.DataConsumInt.Cuentamayor.Nombre);
  }

  getCaducidad(
    Almacen: Almacen,
    Material: Materiales,
    Centro: CentrosConsumoInt
  ) {
    console.log(
      Almacen.IdAlmacen +
        "-----" +
        Material.IdMaterial +
        "-----" +
        Centro.IdCentro
    );
    this.CADUCIDAD = this.solicitudComp.getAllCaducidad(
      Almacen.IdAlmacen,
      Material.IdMaterial,
      Centro.IdCentro
    );
    this.ListCaducidad.push(this.CADUCIDAD);
    this.DataConsumInt.Caducidad = this.CADUCIDAD;
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
    this.ProductConsumInt.UnidadMedida = this.DataConsumInt.UMedida.IdUnidadMedida;
    this.ProductConsumInt.NameUnidadMedida = this.DataConsumInt.UMedida.NombreUnidadMedida;
  }

  addProductoConsumInt() {
    this.ProductConsumInt.Caducidad = (this.DataConsumInt.Caducidad.CHARG == "") ? "0000-00-00" :this.DataConsumInt.Caducidad.CHARG;
    this.ProductConsumInt.Cantidad = this.DataConsumInt.Cantidad;

    if (
      this.ProductConsumInt.Almacen != undefined ||
      this.ProductConsumInt.AlmacenName != undefined ||
      this.ProductConsumInt.Caducidad != undefined ||
      this.ProductConsumInt.CentroCosto != undefined ||
      this.ProductConsumInt.CentroCostoName != undefined ||
      this.ProductConsumInt.CuentaMayor != undefined ||
      this.ProductConsumInt.CuentaMayorName != undefined ||
      this.ProductConsumInt.Material != undefined ||
      this.ProductConsumInt.MaterialName != undefined ||
      this.ProductConsumInt.NameUnidadMedida != undefined ||
      this.ProductConsumInt.UnidadMedida
    ) {
      this.DataConsumInt.Productos.push(this.ProductConsumInt);
      if (this.DataConsumInt.Productos.length > 0) {
        this.BloqCentro = true;
      }
      this.ProductConsumInt = new ProductoConsumoInterno();
      this.DataConsumInt.Cantidad = 0;
      this.getAllAlmacen(this.DataConsumInt.Centro);
      this.getAllCentroCosto(
        this.DataConsumInt.Empresa,
        this.DataConsumInt.Centro
      );
      this.getAllCuentasMayor(this.DataConsumInt.Empresa);
      if (this.DataConsumInt.Materiales != undefined) {
        this.ListMateriales = undefined;
        this.filteredMaterial.next(this.ListMateriales);
      }
      var Material: String = " ";
      this.getunidadMedida(Material);
      this.ListCaducidad = undefined;
    }
  }

  deleteProd(producto: ProductoConsumoInterno) {
    console.log(producto);
    const pos = this.DataConsumInt.Productos.map((elem) => elem).indexOf(
      producto
    );
    console.log(pos);
    this.DataConsumInt.Productos.splice(pos, 1);
    if (
      this.DataConsumInt.Productos.length === 0 ||
      this.DataConsumInt.Productos.length === undefined
    ) {
      this.BloqCentro = false;
    }
  }

  async CheckValidaciones() {
    console.log(this.DataConsumInt);
    this.DataConsumInt.Justificacion = this.RemoveCaracteresEpeciales(this.DataConsumInt.Justificacion);
    if (
      this.DataConsumInt.Empresa === undefined ||
      this.DataConsumInt.Centro === undefined ||
      this.DataConsumInt.Justificacion === "" ||
      this.DataConsumInt.Justificacion === undefined ||
      this.DataConsumInt.Productos.length === 0
    ) {
      this.toast.setMessage(
        "No se puede guardar una Solicitud de Consumo Interno si no tiene un Producto asociado",
        "danger"
      );
      console.log("no se puede acrear la solicitud");
    } else {
      
      //Preguntamos si existe algun role para la direccion asociada al usr, si requiere que se excluya a un autorizador y que nivel es el que se exluira
      console.log(this.DataConsumInt.Productos);
      try {
        const IdExcepctionRole = await this.ValidateExeptionforDireccion(this.DataConsumInt.Area.IdDireccion);
        console.log("000000000000000")
        console.log(IdExcepctionRole);

        if(IdExcepctionRole === null || IdExcepctionRole === 0){
          this.SendInsertandCheckoutUserAutorization(2, "S. C. I. NUEVA PETICION", 1);
        }else if(IdExcepctionRole === 2){
          this.SendInsertandCheckoutUserAutorization(3, "S. C. I. AUTORIZADA POR GERENTE", 2);
        }else if(IdExcepctionRole === 3){
          this.SendInsertandCheckoutUserAutorization(2, "S. C. I. NUEVA PETICION", 1);
        }
      } catch (error) {
        if (error.status == 403 || error.status == 404) {
          this.toast.setMessage(error.message, "danger");
          this.auth.logout();
        }
        this.toast.setMessage( error.message, "danger");
      }
    }
  }

  async ValidateExeptionforDireccion(IdDireccion:number){
    return  new Promise(async (resolve, reject) => {
      this.solconsumoserv.validaRolExceptionForDir(IdDireccion).subscribe(data=>{
        console.log(data[0].IdRoleConsumoInterno);
         resolve(data[0].IdRoleConsumoInterno);
      }, error=>{
        console.log(error);
      });
    });
  }

  SendInsertandCheckoutUserAutorization(IdRole:number, Estatus:string, StatusSolicitud:number){
    this.DataConsumInt.IdStatusSolConsumoInt = StatusSolicitud;
    console.log(this.DataConsumInt.IdStatusSolConsumoInt);
    this.solconsumoserv.insertNewSolConsumoInterno(this.DataConsumInt)
        .subscribe(
          (data: any) => {
            console.log(data.idsol);
            var IdNewSolicitud = data.idsol;
            var Role;
            var status;
            
            if (data) {
              this.toast.setMessage(data.message, "success");
              Role = IdRole;
              status = Estatus;
              console.log(this.DataConsumInt.IdUserSolicitante)
              console.log(Role);
              //preguntamos cual es el user autorizador para enviarle el correo
              this.solconsumoserv
                .getAlldatauserauthSolConsumo(
                  this.DataConsumInt.IdUserSolicitante,
                  Role
                )
                .subscribe(
                  (result: any) => {
                    console.log(result);
                    console.log(result[0].NombreCompleto);
                    //enviamos correo a el gerente o director para su autorizacion.
                    this.solconsumoserv.sendEmailNewSolicitudConsumo(
                        IdNewSolicitud,
                        status,
                        this.auth.currentUser.NombreCompleto,
                        result[0].NombreCompleto,
                        result[0].Email
                      )
                      .subscribe((resp) => {
                        console.log(resp);
                        this.toast.setMessage(resp.message, "success");
                        this.ngOnInit();
                      },error=>{
                        if(error.status == 403 || error.status == 404){
                          this.toast.setMessage(
                            error.message,
                            "danger"
                          );
                          this.auth.logout();
                        }
                        console.log(error);
                        this.toast.setMessage(error.message, "success");
                      })
                      
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
                  }
                );

              //this.ngOnInit();
              this.BloqCentro = false;
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
            console.log("errr al recuperar la info" + error);
            this.toast.setMessage(error, "danger");
          }
      );
  }

  RemoveCaracteresEpeciales(str) {
    if(str == undefined || str == null){
      this.toast.setMessage("El campo de justificacion es requerido, favor de validar la informacion", "warning");
    }else{
      var j: number;
      var format = str.replace(/['"]+/g, ' ');
      format = format.replace(/[´´]+/g, ' ');
      format = format.replace(/[``]+/g, ' '); 
      format = format.replace(/[¨]+/g, ' ');
  
      //console.log(str)
      var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
        to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
        mapping = {};
  
      for (var i = 0, j = from.length; i < j; i++)
        mapping[from.charAt(i)] = to.charAt(i);
  
      var ret = [];
  
      for (var i = 0, tamaño = format.length; i < tamaño; i++) {
        var c = format.charAt(i);
        //console.log(tamaño);
        if (mapping.hasOwnProperty(format.charAt(i))) ret.push(mapping[c]);
        else ret.push(c);
      }
      //console.log(ret.join( '' ).toString());
      
      var cadena = ret.join("").toString();
      format = cadena.replace(/['"]+/g, ' ');
      format = format.replace(/[´´]+/g, ' ');
      format = format.replace(/[``]+/g, ' '); 
      format = format.replace(/[¨]+/g, ' ');
      format = format.replace(/[|]+/g, ' ');
      format = format.replace(/[~]+/g, ' ');
      format = format.replace(/[#]+/g, ' ');
      return format;
    }
  }

}

