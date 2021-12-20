import {
  Component,
  OnInit,
  TemplateRef,
  Inject,
  ViewChild,
  QueryList,
} from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { BsModalService } from "ngx-bootstrap/modal";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ToastComponent } from "../../shared/toast/toast.component";

import { SolicitudesReg } from "../../shared/models/solicitudesReg.model";
import { Imputacion } from "../../shared/models/imputacion.model";
import { Posiciones } from "../../shared/models/posiciones.model";
import { CuentaMayor } from "../../shared/models/cuentamayor.model";
import { StatusSolicitud } from "../../shared/models/statussolicitud.model";
import { SolicitudRegService } from "../../services/solicitudreg.service";
import { DataUsuarioAsignado } from "../../shared/models/datausiarioasign.model";
import { DataSAP } from "../../shared/models/dataSAP.model";
import { SolicitudPedidoSAP } from "../../shared/models/solpedSAP.model";
import { MensajesSolPed } from "../../shared/models/mensajessolped.model";
import { Direccion } from "../../shared/models/directions.model";
import { Categorias } from "client/app/shared/models/categorias.model";
import { Detallesol } from "../../shared/models/detallesol.model";
import { SolicitudesCompraRegistradas } from "../../shared/models/solicitudcompraRegistradas.model";
import { Childs } from "../../shared/models/childs.model";
import { User } from "../../shared/models/user.model";

import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { AuthServices } from "../../services/auth.service";
import { SolicitudCompraService } from "../../services/solicitudcompra.service";

import { MatPaginatorIntl, PageEvent } from "@angular/material/paginator";
import { PdfViewerModule } from "ng2-pdf-viewer";

//import { SignaturePad } from 'angular2-signaturepad/signature-pad';

import HelloSign from "hellosign-embedded";

@Component({
  selector: "app-solicitudes-registradas",
  templateUrl: "./solicitudes-registradas.component.html",
  styleUrls: ["./solicitudes-registradas.component.css"],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.2, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class SolicitudesRegistradasComponent implements OnInit {
  //@ViewChild(SignaturePad, {static: false})  signaturePad: QueryList<ElementRef>;

  private signaturePadOptions: Object = {
    // passed through to szimek/signature_pad constructor
    minWidth: 5,
    penColor: "#030303",
    backgroundColor: "rgb(255,255,255)",
    canvasWidth: 300,
    canvasHeight: 120,
  };

  pdfSrc: string;

  constructor(
    private solicitudService: SolicitudRegService,
    public solicitudComp: SolicitudCompraService,
    public toast: ToastComponent,
    public auth: AuthServices,
    public dialog: MatDialog,
    private pagin: MatPaginatorIntl
  ) {
    //this.DataUSR = new SolicitudesCompraRegistradas;

    //borramos la variable de local estorage antes de recuperar la infromacion-------
    localStorage.removeItem("mensaje");
  }

  SelectedImputacion: Imputacion | undefined;
  SelectedPosicion: Posiciones | undefined;
  SelectedCMayor: CuentaMayor | undefined;
  SelectedStatus: StatusSolicitud | undefined;
  ListImputacion: Imputacion[];
  ListPosicion: Posiciones[];
  ListCmayor: CuentaMayor[];
  ListStatus: StatusSolicitud[];
  ListDirforUser: Direccion[];
  ListStatusCompras: StatusSolicitud[];
  SelectedCompras: StatusSolicitud;
  ListCategorys: Categorias[];
  SelectCategory: Categorias;
  // ListCategorysforUser: Categorias[];
  // SelectCategoryforUser: Categorias;

  //ListDataSolPed:DataSAP;
  ListSap: SolicitudPedidoSAP = new SolicitudPedidoSAP();

  //isLoading = true;
  /*displayedColumns = ['position', 'RFC', 'weight', 'symbol'];
  dataSource: MatTableDataSource<SolicitudesReg>;
  ListaRegistradas :SolicitudesReg[];*/
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  //tabla que muestra la Solicitud y dando clicl da opcion de ver su detalle
  columnsToDisplay = [
    "ID",
    "USUARIO",
    "FECHASOLICITUD",
    "EMPRESA",
    "DIVISION",
    "DIRECCION",
  ];
  datSource: MatTableDataSource<SolicitudesCompraRegistradas>;

  //tabla donde se visualiza el detalle de la solicitud
  displayedColumns = [
    "CANTIDAD",
    "MEDIDA",
    "BIENOSERV",
    "PRECIO",
    "CECO",
    "CMAYOR",
    "ACTFIJ",
    "IDOINT",
    "OINT",
  ];
  dataSource: MatTableDataSource<Detallesol>;

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

  USR: number;
  Direcc: number;
  ListSolRegistr: SolicitudesCompraRegistradas[];
  ListDetallesol: Detallesol[];
  ListChilds: Childs[];
  MensajeSAP: string;

  fecha: string;
  animal: string;
  SelectedDataList: SolicitudesCompraRegistradas;
  isViewListSolicitudes = false;
  isEditing = false;
  isData = false;
  isSAP = false;
  SelectSolicitud: SolicitudesCompraRegistradas;
  Direccion: Direccion;
  isrechazada = false;

  ListMensaje: string[] = new Array<string>();

  bloqbuttonchild: boolean = false;

  //SignatureImage:string;
  points = [];
  signatureImage: any;
  isfirma: boolean = false;
  UserAuth: User;

  rutacotizacion: string;
  motivo_Rechazo: string;

  is_persona_coprador: boolean;

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.datSource.filter = filterValue;
    if (this.datSource.paginator) {
      this.datSource.paginator.firstPage();
    }
  }

  ngOnInit() {
    this.pagin.itemsPerPageLabel = "REGISTROS POR PAGINA";
    this.Direccion = new Direccion();
    //this.signaturePad = new SignaturePad();
    this.getAllImputaciones();
    //this.getAllPosiciones();
    //this.hellosign();

    if (this.auth.loggedIn) {
      //console.log("esta logeado");
      // console.log(
      //   "Este es el id del Rool que tiene quien se logeo-->" +
      //     this.auth.currentUser.IdRole
      // );
      if (this.auth.isJefeArea) {
        //este metodo solo trae el listado de las solicitudes para el rol Director de Area
        console.log(
          "Este es el Id de el Usuario logeado------>   " +
            this.auth.currentUser.IdUsuario
        );
        this.getDireccionesforUser(this.auth.currentUser.IdUsuario);
        this.isEditing = true;
        this.isViewListSolicitudes = true;
        this.is_persona_coprador = true;
        //metodo que nos regresa filtado las autorizaciones o tipos de status por Nivel
        this.getAllStatusSolicitud(this.auth.currentUser.IdRole);
      } else if (this.auth.isAdmin) {
        console.log(
          "Este es el Id de el Usuario logeado------>   " +
            this.auth.currentUser.IdUsuario
        );
        this.getDireccionesforUser(this.auth.currentUser.IdUsuario);
        this.isEditing = true;
        this.isViewListSolicitudes = true;
        this.is_persona_coprador = true;
        //metodo que nos regresa filtado las autorizaciones o tipos de status por Nivel
        this.getAllStatusSolicitud(this.auth.currentUser.IdRole);
      } else if (this.auth.isDirArea) {
        console.log(
          "Este es el Id de el Usuario logeado------>   " +
            this.auth.currentUser.IdUsuario
        );
        this.getDireccionesforUser(this.auth.currentUser.IdUsuario);
        //este metodo solo trae la lista de las solicitudes creadas para el tipo de Rol Jefe de Area
        this.isEditing = true;
        this.isViewListSolicitudes = true;
        this.is_persona_coprador = true;
        //metodo que nos regresa filtado las autorizaciones o tipos de status por Nivel
        this.getAllStatusSolicitud(this.auth.currentUser.IdRole);
      } else if (this.auth.isCompras) {
        //console.log("Este es el Id del Usuario logeado------->    " +this.auth.currentUser.IdUsuario +"--" +this.auth.isCompras);
        this.getAllCategorias();
        this.getDireccionesforUser(this.auth.currentUser.IdUsuario);
        this.isEditing = true;
        this.isViewListSolicitudes = true;
        this.is_persona_coprador = true;
        this.getStatusCompras(this.auth.currentUser.IdRole, 1);
        this.getAllStatusSolicitud(this.auth.currentUser.IdRole);
      } else if (this.auth.isComprador) {
        //this.getAllCategoriasForUserComprador(this.auth.currentUser.IdUsuario);
        this.getStatusCompras(this.auth.currentUser.IdRole, 1);
        this.getAllStatusSolicitud(this.auth.currentUser.IdRole);
        //this.getAllCategorias();
        this.is_persona_coprador = false;
        this.getDireccionesforUser(this.auth.currentUser.IdUsuario);
        this.isEditing = true;
        this.isViewListSolicitudes = true;
        this.is_persona_coprador = true;
      } else if (this.auth.isCheckPresupuesto) {
        this.isViewListSolicitudes = true;
        this.isEditing = true;
        this.getStatusCompras(this.auth.currentUser.IdRole, 0);
      } else if (this.auth.isIntercambios) {
        this.getStatusCompras(this.auth.currentUser.IdRole, 0);
        this.isViewListSolicitudes = true;
        this.isEditing = true;
      } else {
        this.isEditing = false;
        this.isViewListSolicitudes = false;
      }
    } else {
      console.log("no esta logeado");
    }
  }

  UpdateVista() {
    this.ngOnInit();
    this.ListSolRegistr = [];
    this.datSource = new MatTableDataSource(this.ListSolRegistr);
    this.datSource.paginator = this.paginator;
    this.datSource.sort = this.sort;
  }

  //mat dialog para mostrar firma
  openDialog() {
    this.isfirma = true;
  }
  //-----------------------Implement Firma Digital-------------------------------
  //metodo para recuperar la imagen creada desde la interfaz en base 64
  showImage(data) {
    this.isfirma = false;
    this.signatureImage = data;
    console.log(this.signatureImage);
  }
  //------------------------fin de la firma digital------------------------------

  getDireccionesforUser(IdUser: number) {
    console.log("Este es el id de el Usuario------>   " + IdUser);
    this.solicitudComp.getAllDirectionsForUser(IdUser).subscribe(
      (data) => {
        //console.log(data);
        this.ListDirforUser = data;
      },
      (error) => {
        if (error.status == 403 || error.status == 404) {
          this.toast.setMessage(error.message, "danger");
          this.auth.logout();
        }
        console.log(
          "error al recuperar las diferentes Direcciones del Usuario    " +
            error
        );
      }
    );
  }

  getStatusCompras(IdRole: number, isCompras: number) {
    console.log("metodo para recuperar los status de COMPRAS");
    this.solicitudComp.getStatusforCompras(IdRole, isCompras).subscribe(
      (data) => {
        //console.log(data);
        this.ListStatusCompras = data;
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

  SelectedDireccion() {
    console.log(
      "Esta la direccion que se selecciono--" +
        this.Direccion.IdDireccion +
        "  ---   " +
        this.Direccion.Nombre
    );

    //this.Direccion = Dir;
    if (this.auth.loggedIn) {
      console.log("esta logeado");
      console.log(
        "Este es el id del Rool que tiene quien se logeo-->" +
          this.auth.currentUser.IdRole
      );
      if (this.auth.isJefeArea) {
        /*Metodo que trae las solicitudes por area y por status "Nueva Solicitud" */
        this.getAllSolicitudesRegistradasAutorizadorDir(this.Direccion);
      } else if (this.auth.isAdmin) {
        this.getAllSolicitudesRegistradasAutAdmin(this.Direccion);
      } else if (this.auth.isDirArea) {
        /*Metodo que traera olicitudes registradas nadamas para  el dir de area*/
        this.getAllSolicitudesRegistradasAutFinanzas(this.Direccion);
      } else if (this.auth.isCompras) {
        if (this.SelectedCompras != undefined) {
          this.getAllSolicitudesRegistradasporUsrCompras(this.Direccion,this.SelectedCompras);
        } else {
          this.SelectedCompras = undefined;
        }
      } else if (this.auth.isComprador) {
        if (this.SelectedCompras != undefined) {
          this.getAllSolicitudesRegistradasporUsrComprador(this.Direccion,this.SelectedCompras, this.auth.currentUser.IdUsuario);
        } else {
          console.log(this.auth.currentUser.IdUsuario);
          this.SelectedCompras = undefined;
        }
      } else {
        this.isEditing = false;
        this.isViewListSolicitudes = false;
      }
    } else {
      console.log("no esta logeado");
    }
  }

  async getAllCategorias(){
    try {
      this.ListCategorys = await this.solicitudComp.getAllCategorias();
      if(!this.ListCategorys){
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

  SelectionStatus() {
    if (this.auth.isCompras) {
      this.getAllSolicitudesRegistradasporUsrCompras(this.Direccion, this.SelectedCompras);
    }else if(this.auth.isComprador){
      this.getAllSolicitudesRegistradasporUsrComprador(this.Direccion, this.SelectedCompras, this.auth.currentUser.IdUsuario);
    } else if (this.auth.isCheckPresupuesto || this.auth.isIntercambios) {
      console.log("se selecciono un estatus para el subdirecto de finanzas");
      //console.log(this.SelectedCompras);
      this.getSolPedForStatus(this.SelectedCompras.IdStatusSolicitud);
    }
  }


  getAllSolicitudesRegistradasAutorizadorDir(Dir: Direccion) {
    console.log(
      "Dentro de el metodo para regresar solicitudes por Autorizador de Direccion"
    );
    //console.log("id usr -->"+this.auth.currentUser.IdUsuario);
    this.USR = this.auth.currentUser.IdUsuario;
    this.Direcc = Dir.IdDireccion;
    //console.log("este es el Usuario-->"+this.USR);
    //console.log("esta es la Direccion-->"+this.Direcc);
    var status = 1;
    this.solicitudComp.getAllSolicitudNewSoli(status, this.Direcc).subscribe(
      (data) => {
        this.ListSolRegistr = data;
        if(data.length == 0){
          this.toast.setMessage("Ninguna Solicitud Pendiente para esta Direccion.", "warning");
        }
      },
      (error) => {
        if (error.status == 403 || error.status == 404) {
          this.toast.setMessage(error.message, "danger");
          this.auth.logout();
        }
        console.log("error al recuperar las solicitudes" + error);
      },
      () => {
        this.datSource = new MatTableDataSource(this.ListSolRegistr);
        this.datSource.paginator = this.paginator;
        this.datSource.sort = this.sort;
      }
    );
  }

  getAllSolicitudesRegistradasAutFinanzas(Dir: Direccion) {
    console.log(
      "Dentro de el metodo que trae las solicitudes registradas por gerente de Finanzas"
    );
    this.USR = this.auth.currentUser.IdUsuario;
    this.Direcc = Dir.IdDireccion;
    //console.log("este es el Usuario-->"+this.USR);
    //console.log("esta es la Direccion-->"+this.Direcc);
    var status = 2;
    this.solicitudComp.getAllSolicitudNewSoli(status, this.Direcc).subscribe(
      (data) => {
        if(data.length == 0){
          this.toast.setMessage("Ninguna Solicitud Pendiente para esta Direccion.", "warning");
        }
        this.ListSolRegistr = data;
        //console.log(this.ListSolRegistr);
        // this.ListSolRegistr.forEach(element =>{
        //   if(element.Acronimo == 4 || element.Acronimo == 7){
        //    this.bloqbuttonchild = false;
        //   }else{
        //     this.bloqbuttonchild = true;
        //   }
        // });
      },
      (error) => {
        if (error.status == 403 || error.status == 404) {
          this.toast.setMessage(error.message, "danger");
          this.auth.logout();
        }
        console.log("error al recuperar las Solicitudes para Finanzas" + error);
      },
      () => {
        //console.log("%&/&/)=(&/(&/%&/()(= "+this.bloqbuttonchild);
        this.datSource = new MatTableDataSource(this.ListSolRegistr);
        this.datSource.paginator = this.paginator;
        this.datSource.sort = this.sort;
      }
    );
  }

  getAllSolicitudesRegistradasAutAdmin(Dir: Direccion) {
    console.log(
      "Dentro de el metodo que trae las solicitudes registradas por gerente de Finanzas"
    );
    this.USR = this.auth.currentUser.IdUsuario;
    this.Direcc = Dir.IdDireccion;
    //console.log("este es el Usuario-->"+this.USR);
    //console.log("esta es la Direccion-->"+this.Direcc);
    var status = 4;
    this.solicitudComp.getAllSolicitudNewSoli(status, this.Direcc).subscribe(
      (data) => {
        if(data.length == 0){
          this.toast.setMessage("Ninguna Solicitud Pendiente para esta Direccion.", "warning");
        }
        this.ListSolRegistr = data;
        //console.log(this.ListSolRegistr);
      },
      (error) => {
        if (error.status == 403 || error.status == 404) {
          this.toast.setMessage(error.message, "danger");
          this.auth.logout();
        }
        console.log("error al recuperar las Solicitudes para Finanzas" + error);
      },
      () => {
        // this.ListSolRegistr.forEach(element =>{
        //   if(element.IdTipoSolicitud == 4 || element.IdTipoSolicitud == 7){
        //   this.bloqbuttonchild = true;
        //   }else{
        //     this.bloqbuttonchild = false;
        //   }
        // });
        this.datSource = new MatTableDataSource(this.ListSolRegistr);
        this.datSource.paginator = this.paginator;
        3;
        this.datSource.sort = this.sort;
        //hacer if para mostrar o no el campo de los datos de SAP
        // this.ListSolRegistr.forEach(function(elem,index,array:any){
        //   console.log(elem.IdSAP);
        //   //this.toast.setMessage('Ocurrio algun error al Crear Solicitud en SAP', 'warning');
        //   if(elem.IdSAP == null){

        //     //escondemos el campo donde se muestra el id de sap
        //     elem.isSAP = false;
        //     //mostramos el combo box para que puedan cambiar el satuts de la solicitud
        //     elem.isChangeStatus = true
        //   }else{
        //     //mostramos el campo de SAP ya con el registro de el ID de SAP
        //     elem.isSAP = true;
        //     //ocultamos el combo box para que ya no se genere un nuevo cambio de Satus
        //     elem.isChangeStatus = false;
        //   }
        // })
      }
    );
  }

  getAllSolicitudesRegistradasporUsrCompras(
    Dir: Direccion,
    status: StatusSolicitud
  ) {
    //console.log("recuperando el listado de las solicitudes para Compras");
    this.USR = this.auth.currentUser.IdUsuario;
    this.Direcc = Dir.IdDireccion;
    //console.log(status);
    this.solicitudComp.getAllSolicitudNewSoli(status.IdStatusSolicitud, this.Direcc)
      .subscribe(
        (data) => {
          if(data.length == 0){
            this.toast.setMessage("Ninguna Solicitud Pendiente para esta Direccion.", "warning");
          }
          this.ListSolRegistr = data;
          //console.log(this.ListSolRegistr);
        },
        (error) => console.log("error al recuperar las solicitudes" + error),
        () => {
          this.datSource = new MatTableDataSource(this.ListSolRegistr);
          this.datSource.paginator = this.paginator;
          this.datSource.sort = this.sort;
        }
      );
  }

  getAllSolicitudesRegistradasporUsrComprador(Dir: Direccion, status: StatusSolicitud, IdUser:number) {
    //console.log("recuperando el listado de las solicitudes para Compras");
    this.USR = this.auth.currentUser.IdUsuario;
    this.Direcc = Dir.IdDireccion;
    //console.log(status);
    this.solicitudComp.getAllSolicitudNewSoliforCategori(status.IdStatusSolicitud, this.Direcc, IdUser)
      .subscribe(
        (data) => {
          if(data.length == 0){
            this.toast.setMessage("Ninguna Solicitud Pendiente para esta Direccion.", "warning");
          }
          this.ListSolRegistr = data;
        },
        (error) => console.log("error al recuperar las solicitudes" + error),
        () => {
          this.datSource = new MatTableDataSource(this.ListSolRegistr);
          this.datSource.paginator = this.paginator;
          this.datSource.sort = this.sort;
        }
      );
  }

  //metodo para buiscar las solicitudes por estatus aplica para Subdirector de Finanzas e Intercambios
  getSolPedForStatus(IdStatus: number) {
    console.log(IdStatus);
    this.solicitudComp
      .getAllSolicitudesForStatusPresupuesto(IdStatus)
      .subscribe(
        (data) => {
          console.log(data);
          this.ListSolRegistr = data;
          if (this.ListSolRegistr.length == 0) {
            this.toast.setMessage(
              "No existe ninguna Solicitud de Pedido para el estatus seleccionado ",
              "success"
            );
          }
        },
        (error) => {
          if (error.status == 403 || error.status == 404) {
            this.toast.setMessage(error.message, "danger");
            this.auth.logout();
          }
          console.log(
            "error al recueprar las solicitudes por estatus para el que monitorea el de presupuesto" +
              error
          );
        },
        () => {
          this.datSource = new MatTableDataSource(this.ListSolRegistr);
          this.datSource.paginator = this.paginator;
          this.datSource.sort = this.sort;
        }
      );
  }

  //cambiar el status de las solicitudes revisadas por la gente de comrpas.
  changedStatusCompras(optiondata: SolicitudesCompraRegistradas) {
    console.log(
      "dentro del metodo para actualizar el status de la Solicitud a revisada por Compras"
    );
    console.log("estos son los datos de la SOLPED que se selecciono");
    console.log(optiondata.ID);
    this.solicitudComp.getChangestatusCompras(optiondata.ID, 9).subscribe(
      (data) => {
        //console.log("se actualizo el status de la solicitud   " + data);
        this.UpdateVista();
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

  //metodo que creara archivo de excel con los datos necesarios para que compras comience el proceso de Tabla Comparativa
  getdownloadFile(optiondata: SolicitudesCompraRegistradas) {
    //console.log("Esta es la solicitud registrada-->");
    //console.log(optiondata);
    this.solicitudComp.getFileCompras(optiondata.ID).subscribe(
      (data) => {
        //console.log(data);
        window.open(data.toString(), "_blank");
      },
      (error) => {
        if (error.status == 403 || error.status == 404) {
          this.toast.setMessage(error.message, "danger");
          this.auth.logout();
        }
        this.toast.setMessage(error.message, "danger");
        console.log(error);
      }
    );
  }

  //cuando se apriete el boton editar se abrira y mostrara el detalle de la solicitud (Info Completa)
  enableEditing(optiondata: SolicitudesCompraRegistradas) {
    //console.log("dentro de el metodo que detecta cuando se edita");
    this.isEditing = false;
    this.isData = true;
    this.isViewListSolicitudes = false;
    //console.log(optiondata.Id);
    //console.log(optiondata.NombreUsuario);
    //console.log(optiondata.Acronimo[0])
    this.SelectedDataList = optiondata;
    //console.log(this.SelectedDataList.Id);
    //this.getAllSolicitudesRegistradasAutorizador();
    this.solicitudComp.getDetalleSolicitud(this.SelectedDataList.ID).subscribe(
      (data) => {
        this.ListDetallesol = data;
        //console.log(this.ListDetallesol);
        if (optiondata.Acronimo[0] == 6 || optiondata.Acronimo[0] == 7) {
          this.bloqbuttonchild = true;
        } else {
          this.bloqbuttonchild = false;
        }
        // this.ListSolRegistr.forEach(element =>{

        // });
      },
      (error) => {
        if (error.status == 403 || error.status == 404) {
          this.toast.setMessage(error.message, "danger");
          this.auth.logout();
        }
        console.log("error al traer el detalle de la solicitud" + error);
      },
      () => {
        this.dataSource = new MatTableDataSource(this.ListDetallesol);

        this.dataSource.paginator = this.paginator;

        this.dataSource.sort = this.sort;
      }
    );
  }

  ViewChilds(SolPed: Detallesol) {
    console.log("Este es el ide del Item a consultar----");
    console.log(SolPed.IdProducto);
    this.solicitudComp.getDetalleSubItems(SolPed.IdProducto).subscribe(
      (data) => {
        //console.log("----------------------------------");
        //console.log(data);
        this.ListChilds = data;
        console.log("datos dentro del Objeto");
        this.ListDetallesol.forEach((element) => {
          element.SubHijos = this.ListChilds;
          //console.log("*/*/*/*/*/*/*");
          //console.log(element);
          this.dataChilds = new MatTableDataSource(element.SubHijos);

          if (SolPed.IdProducto == element.IdProducto) {
            element.isOpen = true;
          } else {
            element.isOpen = false;
          }
        });

        // if(this.ListChilds.length > 0){
        //   this.isviewChilds = true;
        // }
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

  //aplica cuando se cancela la edicion de una solicitud
  cancelEditing() {
    this.isEditing = true;
    this.isData = false;
    this.isViewListSolicitudes = true;
    this.toast.setMessage("Revision Detalle", "success");

    if (this.auth.currentUser.IdRole == 2) {
      this.getAllSolicitudesRegistradasAutorizadorDir(this.Direccion);
    } else if (this.auth.currentUser.IdRole == 3) {
      this.getAllSolicitudesRegistradasAutFinanzas(this.Direccion);
    } else if (this.auth.currentUser.IdRole == 4) {
      this.getAllSolicitudesRegistradasAutAdmin(this.Direccion);
    } else if (this.auth.currentUser.IdRole == 6) {
      if (this.SelectedCompras != undefined) {
        this.getAllSolicitudesRegistradasporUsrCompras(
          this.Direccion,
          this.SelectedCompras
        );
      } else {
        this.SelectedCompras = undefined;
        this.toast.setMessage(
          "Por favor selecciona un Estatus a bucar",
          "warning"
        );
      }
    } else if (this.auth.currentUser.IdRole == 7) {
      if (this.SelectedCompras != undefined) {
        this.getAllSolicitudesRegistradasporUsrComprador(this.Direccion, this.SelectedCompras, this.auth.currentUser.IdUsuario);
      } else {
        this.SelectedCompras = undefined;
        this.toast.setMessage(
          "Por favor selecciona un Estatus a buscar",
          "warning"
        );
      }
    }
  }

  //aplica cuando se guarda la info restante en caso de los gerentes de finanzas
  guardaGerente() {
    //console.log("dentro de el metodo que regresa la lista");
    this.isData = false;
    this.isEditing = true;
    this.isViewListSolicitudes = true;
  }

  getAllStatusSolicitud(idRole: number) {
    this.solicitudComp.getAllStatusSolicitud(idRole).subscribe(
      (data) => (this.ListStatus = data),
      (error) => {
        if (error.status == 403 || error.status == 404) {
          this.toast.setMessage(error.message, "danger");
          this.auth.logout();
        }
        console.log("Error al traer los status" + error);
      }
    );
  }

  selectedStatus() {
    console.log(this.SelectedStatus.IdStatusSolicitud);
    console.log(this.SelectedStatus.Nombre);
    if (
      this.SelectedStatus.IdStatusSolicitud == 3 ||
      this.SelectedStatus.IdStatusSolicitud == 5 ||
      this.SelectedStatus.IdStatusSolicitud == 7 ||
      this.SelectedStatus.IdStatusSolicitud == 9
    ) {
      this.isrechazada = true;
    } else {
      this.isrechazada = false;
    }
  }

  getAllCuentasMayor() {
    // this.solicitudComp.getCuentaMayor().subscribe(
    //   data => this.ListCmayor = data,
    //     //console.log(data);
    //   //},
    //   error=> console.log("errroooorrr" + error)
    // );
  }

  selectionCMayor() {
    console.log(this.SelectedCMayor.IdCuentaMayor);
    console.log(this.SelectedCMayor.Nombre);
  }

  getAllImputaciones() {
    this.solicitudComp.getAllImputaciones().subscribe(
      (data) => {
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
    console.log(this.SelectedImputacion.IdTipoSolicitud);
    console.log(this.SelectedImputacion.Acronimo);
    console.log(this.SelectedImputacion.Nombre);
  }

  getAllPosiciones() {
    this.solicitudComp.getAllPosiciones().subscribe(
      (data) => (this.ListPosicion = data),
      (error) => {
        if (error.status == 403 || error.status == 404) {
          this.toast.setMessage(error.message, "danger");
          this.auth.logout();
        }
      }
    );
  }

  selectPosicion() {
    console.log(this.SelectedPosicion.IdPosicion);
    console.log(this.SelectedPosicion.Nombre);
  }

  validaStatus(data2: SolicitudesCompraRegistradas) {
    console.log(this.SelectedStatus.IdStatusSolicitud)
    if (this.auth.isJefeArea) {
      console.log("Es generente de Direccion");
      if (
        this.SelectedStatus.IdStatusSolicitud == 2 ||
        this.SelectedStatus.IdStatusSolicitud == 3
      ) {

        console.log("valores de la solicitud por autorizar o rechazar");
        // console.log(data2);
        // console.log(data2.ID);
        // console.log(data2.DIVISION);
        // console.log(data2);
        this.SelectSolicitud = data2;
        this.SelectedStatus.IdSolicitud = data2.ID;
        //console.log(this.SelectedStatus.IdStatusSolicitud);
        //Revisar si se tiene una Excepcion de autorizacion a cualquier nivel
        //console.log(this.Direccion.IdDireccion);
        this.solicitudComp.checkdirauthexeption(this.Direccion.IdDireccion).subscribe(
            (data) => {
              // console.log("*/*/*/*/*/*/*/*/*/Validacion de EXCEOCION*/*/*/*/*/*/*/*/*/*/")
              // console.log(data[0]);
              // console.log("*/*/*/*/*/*/*/*/*/Validacion de EXCEOCION*/*/*/*/*/*/*/*/*/*/")
              if (data[0] != undefined || data[0] != null) {
                //si tenemos un registro o Id de Role a excluir lo manejamos para actualizar correctamente el estatus
                if (data[0].IdRole == 2) {
                  if (this.SelectedStatus.IdStatusSolicitud == 2) {
                    console.log("METODO PENSANDO EN QUE SE DEBE EXCLUIR AL GERENTE Y LO PASAMOS DIRECTO A PLANEACION");
                    this.SelectedStatus.IdStatusSolicitud = 4; //se cambia el estatus a S. P. AUTORIZADO POR DIRECCION para que le aparesca a Planeacion
                    // console.log(this.SelectSolicitud.ID);
                    // console.log(this.SelectSolicitud.DIVISION);
                    this.solicitudComp.UpdateStatusSolicitud(this.SelectedStatus.IdStatusSolicitud,this.SelectedStatus.IdSolicitud,this.motivo_Rechazo)
                      .subscribe(
                        (res) => {
                          this.toast.setMessage(
                            "Actualizacion de estatus correcta",
                            "success"
                          );
                          this.getAllSolicitudesRegistradasAutorizadorDir(this.Direccion);
                          //Buscamos cual es el Usuario del area de Planeacion para notificarlo a el haciendo la excepcion a DIRECCIon
                          this.solicitudComp
                            .getUserAutorizador(this.Direccion.IdDireccion, 4)
                            .subscribe(
                              (res) => {
                                console.log(res);
                                this.UserAuth = res;
                                console.log(this.UserAuth[0].Email);

                                this.isrechazada = false;
                                this.motivo_Rechazo = '';
                                this.SelectedStatus = undefined;
                                //Parte donde se envia El correo para los Diferentes autorizadores
                                this.solicitudComp.SendEmailGerenteFianzas(
                                    data2.ID,
                                    this.SelectedStatus.IdStatusSolicitud,
                                    this.Direccion.IdDireccion,
                                    data2.NombreUsuario,
                                    this.auth.currentUser.IdRole,
                                    this.auth.currentUser.NombreCompleto,
                                    this.UserAuth[0].Email
                                  )
                                  .subscribe(
                                    (res) => {
                                      this.toast.setMessage("Error en el envio de el Correo","warning");
                                      console.log("dento de el metodo para enviar el correo" +res);
                                    },
                                    (error) => {
                                      console.log("Error al enviar el correo " + error);
                                      this.toast.setMessage( "Envio de Email Correcto","success");
                                    }
                                  );
                              },
                              (err) => {
                                console.log("error al recuperar la informacion del Autorizador" + err);
                              }
                            );
                        },
                        (error) =>
                          console.log("error al actualizar el status" + error)
                      );
                  }
                  }else if(data[0].IdRole == 3){
                  console.log("entrando a la exepcion de rol 3");

                    console.log("METODO QUE EXCLUYE AL DIR Y SE MANDA DIRECTO A PLANEACION");
                    this.SelectedStatus.IdStatusSolicitud = 4; //se cambia el estatus a S. P. AUTORIZADO POR DIRECCION para que le aparesca a Planeacion
                    // console.log(this.SelectSolicitud.ID);
                    // console.log(this.SelectSolicitud.DIVISION);
                    this.solicitudComp.UpdateStatusSolicitud(this.SelectedStatus.IdStatusSolicitud,this.SelectedStatus.IdSolicitud,this.motivo_Rechazo)
                      .subscribe(
                        (res) => {
                          this.toast.setMessage(
                            "Actualizacion de estatus correcta",
                            "success"
                          );
                          this.getAllSolicitudesRegistradasAutorizadorDir(this.Direccion);
                          //Buscamos cual es el Usuario del area de Planeacion para notificarlo a el haciendo la excepcion a DIRECCIon
                          this.solicitudComp
                            .getUserAutorizador(this.Direccion.IdDireccion, 4)
                            .subscribe(
                              (res) => {
                                console.log(res);
                                this.UserAuth = res;
                                console.log(this.UserAuth[0].Email);
                                this.isrechazada = false;
                                this.motivo_Rechazo = '';
                                this.SelectedStatus = undefined;
                                //Parte donde se envia El correo para los Diferentes autorizadores
                                this.solicitudComp.SendEmailGerenteFianzas(
                                    data2.ID,
                                    this.SelectedStatus.IdStatusSolicitud,
                                    this.Direccion.IdDireccion,
                                    data2.NombreUsuario,
                                    this.auth.currentUser.IdRole,
                                    this.auth.currentUser.NombreCompleto,
                                    this.UserAuth[0].Email
                                  )
                                  .subscribe(
                                    (res) => {
                                      
                                      this.toast.setMessage("Error en el envio de el Correo","warning");
                                      console.log("dento de el metodo para enviar el correo" +res);
                                    },
                                    (error) => {
                                      console.log("Error al enviar el correo " + error);
                                      this.toast.setMessage( "Envio de Email Correcto","success");
                                    }
                                  );
                              },
                              (err) => {
                                console.log("error al recuperar la informacion del Autorizador" + err);
                              }
                            );
                        },
                        (error) =>
                          console.log("error al actualizar el status" + error)
                      );
                  
                } else {
                  this.solicitudComp.UpdateStatusSolicitud(
                      this.SelectedStatus.IdStatusSolicitud,
                      this.SelectedStatus.IdSolicitud,
                      this.motivo_Rechazo
                    )
                    .subscribe(
                      (res) => {
                        this.toast.setMessage(
                          "Actualizacion de estatus correcta",
                          "success"
                        );
                        
                        this.getAllSolicitudesRegistradasAutorizadorDir(
                          this.Direccion
                        );
                        //Buscamos cual es el Usuario Director de area para enviar el correo directo a el
                        this.solicitudComp.getUserAutorizador(this.Direccion.IdDireccion, 3)
                          .subscribe(
                            (res) => {
                              //console.log(res);
                              this.UserAuth = res;
                              //console.log(this.UserAuth[0].Email);
                              this.isrechazada = false;
                              this.motivo_Rechazo = '';
                              this.SelectedStatus = undefined;
                              //Parte donde se envia El correo para los Diferentes autorizadore
                              this.solicitudComp
                                .SendEmailDirectorArea(
                                  data2.ID,
                                  this.SelectedStatus.IdStatusSolicitud,
                                  this.Direccion.IdDireccion,
                                  data2.NombreUsuario,
                                  this.auth.currentUser.IdRole,
                                  this.auth.currentUser.NombreCompleto,
                                  this.UserAuth[0].Email
                                )
                                .subscribe(
                                  (res) => {
                                    
                                    this.toast.setMessage(
                                      "Error en el envio de el Correo",
                                      "warning"
                                    );
                                    
                                    // console.log(
                                    //   "dento de el metodo para enviar el correo" +
                                    //     res
                                    // );
                                  },
                                  (error) => {
                                    // this.isrechazada = false;
                                    // this.motivo_Rechazo = '';
                                    // this.SelectedStatus = undefined;
                                    this.toast.setMessage(
                                      "Envio de Email Correcto",
                                      "success"
                                    );
                                  }
                                );
                            },
                            (err) => {
                              console.log(
                                "error al recuperar la informacion del Autorizador" +
                                  err
                              );
                            }
                          );
                      },
                      (error) =>
                        console.log("error al actualizar el status" + error)
                    );
                }
              } else {
                console.log("no tenemos ninguna excepcion de autorizacion");
                // console.log(this.SelectSolicitud.ID);
                // console.log(this.SelectSolicitud.DIVISION);
                this.solicitudComp
                  .UpdateStatusSolicitud(
                    this.SelectedStatus.IdStatusSolicitud,
                    this.SelectedStatus.IdSolicitud,
                    this.motivo_Rechazo
                  )
                  .subscribe(
                    (res) => {
                      this.toast.setMessage(
                        "Actualizacion de Status Correcta ",
                        "success"
                      );
                      console.log(
                        "Se actualizo Correctamente ------Como gerente de Direccion -----" +
                          res
                      );
                      this.getAllSolicitudesRegistradasAutorizadorDir(
                        this.Direccion
                      );
                      //Buscamos cual es el Usuario Director de area para enviar el correo directo a el
                      this.solicitudComp
                        .getUserAutorizador(this.Direccion.IdDireccion, 3)
                        .subscribe(
                          (res) => {
                            //console.log(res);
                            this.UserAuth = res;
                            //onsole.log(this.UserAuth[0].Email);
                            this.isrechazada = false;
                            this.motivo_Rechazo = '';
                            this.SelectedStatus = undefined;
                            //Parte donde se envia El correo para los Diferentes autorizadores
                            //mandamos el id y el nombre del usuario que entra autorizar para validar si tiene permisos

                            this.solicitudComp
                              .SendEmailDirectorArea(
                                data2.ID,
                                this.SelectedStatus.IdStatusSolicitud,
                                this.Direccion.IdDireccion,
                                data2.NombreUsuario,
                                this.auth.currentUser.IdRole,
                                this.auth.currentUser.NombreCompleto,
                                this.UserAuth[0].Email
                              )
                              .subscribe(
                                (res) => {
                                  
                                  this.toast.setMessage(
                                    "Error en el envio de el Correo",
                                    "warning"
                                  );
                                },
                                (error) => {
                                  console.log(
                                    "Error al enviar el correo " + error
                                  );
                                  // this.isrechazada = false;
                                  // this.motivo_Rechazo = '';
                                  // this.SelectedStatus = undefined;
                                  this.toast.setMessage(
                                    "Envio de Email Correcto",
                                    "success"
                                  );
                                }
                              );
                          },
                          (err) => {
                            console.log(
                              "error al recuperar la informacion del Autorizador" +
                                err
                            );
                          }
                        );
                    },
                    (error) =>
                      console.log("error al actualizar el status" + error)
                  );
              }
            },
            (err) => {
              console.log(err)
              console.log(
                "Error al intentar recuperar los datos de algua excepcion"
              );
              this.toast.setMessage(
                "Ocurrio un error, por favor intenta mas tarde",
                "warning"
              );
            }
          );
      
      } else {
        this.toast.setMessage(
          "No tienes permisos para cambiar a este Status",
          "warning"
        );
      }
    } 

    if (this.auth.isDirArea) {
      console.log("Es Director de area");
      if (
        this.SelectedStatus.IdStatusSolicitud == 4 ||
        this.SelectedStatus.IdStatusSolicitud == 5
      ) {
       
        //console.log(data2.ID);
        //console.log(data2.DIVISION);
        this.SelectedStatus.IdSolicitud = data2.ID;
        //console.log(this.SelectedStatus.IdSolicitud);
        if(this.SelectedStatus.IdStatusSolicitud == 5){
          const lengRechazo = (this.motivo_Rechazo || '').trim();
          if(lengRechazo.length === 0){
            this.toast.setMessage("Se esta rechazando una Solicitud se requiere un Motivo de Rechazo.", 'warning');
          }else{
            this.solicitudComp
              .UpdateStatusSolicitud(
                this.SelectedStatus.IdStatusSolicitud,
                this.SelectedStatus.IdSolicitud,
                this.motivo_Rechazo
              ).subscribe(
                (res) => {
                  this.toast.setMessage(
                    "Actualizacion de estatus correcta",
                    "success"
                  );
                  // console.log(
                  //   "se actualizo el status ----- Como Gerente de Finanzas----" +
                  //     res
                  // );
                  this.getAllSolicitudesRegistradasAutFinanzas(this.Direccion); //Buscamos cual es el Usuario que lleva la Direccion y Autoriza su presupuesto
                  this.solicitudComp.getUserAutorizador(this.Direccion.IdDireccion, 4)
                    .subscribe(
                      (res) => {
                        // console.log("++++++++++++++++++");
                        // console.log(res);
                        // console.log("++++++++++++++++++");
                        this.UserAuth = res;
                        // console.log(this.UserAuth[0]);
                        // //Parte donde se envia El correo para los Diferentes autorizadores
                        // //mandamos el id y el nombre de l usuario que entra autorizar para validar si tiene permisos
                        // console.log(this.auth.currentUser.IdUsuario);
                        // console.log(this.auth.currentUser.NombreCompleto);
                        // console.log(this.auth.currentUser.IdRole);
                        // console.log(
                        //   "El mail por usuario --->" + this.auth.currentUser.Email
                        // );
                        // console.log(
                        //   "El mail por usuario Autrorizador --->" +
                        //     this.UserAuth[0].Email
                        // );
                        this.isrechazada = false;
                        this.motivo_Rechazo = '';
                        this.SelectedStatus = undefined;
                        this.solicitudComp.SendEmailGerenteFianzas(
                            data2.ID,
                            this.SelectedStatus.IdStatusSolicitud,
                            this.Direccion.IdDireccion,
                            data2.NombreUsuario,
                            this.auth.currentUser.IdRole,
                            this.auth.currentUser.NombreCompleto,
                            this.UserAuth[0].Email)
                          .subscribe(
                            (res) => {
                              
                              this.toast.setMessage("Error en el envio de el Correo","warning");
                              console.log("dento de el metodo para enviar el correo" + res);
                            },
                            (error) => {
                              console.log("Error al enviar el correo " + error);
                              this.toast.setMessage(
                                "Envio de Email Correcto",
                                "success"
                              );
                            }
                          );
                      },
                      (err) => {
                        console.log(
                          "error al recuperar la informacion del Autorizador" + err
                        );
                      }
                    );
                },
                (error) => console.log("error al actualizar en status" + error)
              );
          }
          //console.log("es otro estatus o no esta indefinido la variable de rechazo")
        }else{
          this.solicitudComp
            .UpdateStatusSolicitud(
              this.SelectedStatus.IdStatusSolicitud,
              this.SelectedStatus.IdSolicitud,
              this.motivo_Rechazo
            ).subscribe(
              (res) => {
                this.toast.setMessage(
                  "Actualizacion de estatus correcta",
                  "success"
                );
                // console.log(
                //   "se actualizo el status ----- Como Gerente de Finanzas----" +
                //     res
                // );
                this.getAllSolicitudesRegistradasAutFinanzas(this.Direccion); //Buscamos cual es el Usuario que lleva la Direccion y Autoriza su presupuesto
                this.solicitudComp.getUserAutorizador(this.Direccion.IdDireccion, 4)
                  .subscribe(
                    (res) => {
                      // console.log("++++++++++++++++++");
                      // console.log(res);
                      // console.log("++++++++++++++++++");
                      this.UserAuth = res;
                      // console.log(this.UserAuth[0]);
                      // //Parte donde se envia El correo para los Diferentes autorizadores
                      // //mandamos el id y el nombre de l usuario que entra autorizar para validar si tiene permisos
                      // console.log(this.auth.currentUser.IdUsuario);
                      // console.log(this.auth.currentUser.NombreCompleto);
                      // console.log(this.auth.currentUser.IdRole);
                      // console.log(
                      //   "El mail por usuario --->" + this.auth.currentUser.Email
                      // );
                      // console.log(
                      //   "El mail por usuario Autrorizador --->" +
                      //     this.UserAuth[0].Email
                      // );
                      this.isrechazada = false;
                      this.motivo_Rechazo = '';
                      this.SelectedStatus = undefined;
                      this.solicitudComp.SendEmailGerenteFianzas(
                          data2.ID,
                          this.SelectedStatus.IdStatusSolicitud,
                          this.Direccion.IdDireccion,
                          data2.NombreUsuario,
                          this.auth.currentUser.IdRole,
                          this.auth.currentUser.NombreCompleto,
                          this.UserAuth[0].Email)
                        .subscribe(
                          (res) => {
                            this.toast.setMessage("Error en el envio de el Correo","warning");
                            console.log("dento de el metodo para enviar el correo" + res);
                          },
                          (error) => {
                            if (error.status == 403 || error.status == 404) {
                              this.toast.setMessage(error.message, "danger");
                              this.auth.logout();
                            }
                            console.log("Error al enviar el correo " + error);
                            this.toast.setMessage(
                              "Envio de Email Correcto",
                              "success"
                            );
                          }
                        );
                    },
                    (err) => {
                      console.log(
                        "error al recuperar la informacion del Autorizador" + err
                      );
                    }
                  );
              },
              (error) => console.log("error al actualizar en status" + error)
            );
        }
      } else {
        this.toast.setMessage(
          "No tienes permisos para cambiar a este Status",
          "warning"
        );
      }
    } 

    if (this.auth.isAdmin) {
      console.log("Es Gerente de Finanzas");
      if (
        this.SelectedStatus.IdStatusSolicitud == 6 ||
        this.SelectedStatus.IdStatusSolicitud == 7
      ) {
        //this.toast.setMessage('Si tienes permisos----', 'success');
        // console.log(data2.ID);
        // console.log(data2.DIVISION);
        // console.log(data2.Statname);
        this.SelectedStatus.IdSolicitud = data2.ID;
        //console.log(this.SelectedStatus.Nombre + "*/**/*/*/*/*//*Nombre de la Solicitude Seleccionada/*/*/*/*/*/*/*");
        //console.log(this.SelectedStatus.IdStatusSolicitud + "  Este es el id de la solicitud");
        //validamos si el estatus seleccionado es rechazado y si si despues pasamos a validar si se lleno un motivo de rechazo si no no podemos actualizar.
        if (this.SelectedStatus.IdStatusSolicitud == 7) {
          const lengRechazo = (this.motivo_Rechazo || '').trim();
          if (lengRechazo.length === 0) {
            this.toast.setMessage("Si se rechaza la Solicitud, se debe ingresar un motivo de dicho rechazo.","warning");
          } else {
            this.solicitudComp
              .UpdateStatusSolicitud(
                this.SelectedStatus.IdStatusSolicitud,
                this.SelectedStatus.IdSolicitud,
                this.motivo_Rechazo
              )
              .subscribe(
                (res) => {
                  this.toast.setMessage(
                    "Actualizacion de estatus correcta",
                    "success"
                  );
                  console.log(
                    "se actualozo el status como -----Administrador-----" + res
                  );
                  this.getAllSolicitudesRegistradasAutAdmin(this.Direccion);
                  //Buscamos cual es el Usuario que lleva la Direccion y Autoriza su presupuesto
                  this.solicitudComp.getUserAutorizador(this.Direccion.IdDireccion, 1).subscribe(
                      (res) => {
                        //console.log(res);
                        this.UserAuth = res;
                        this.isrechazada = false;
                        this.motivo_Rechazo = '';
                        this.SelectedStatus = undefined;
                        //console.log(this.UserAuth[0]);
                        //Pedimos el usuario creador de la solicitude de pedido para notificarle que ya se envio a SAP la SOLPED
                        // console.log(this.auth.currentUser.Email);
                        // console.log(
                        //   "este es el email del Usaurio Autorizador" +
                        //     this.UserAuth.Email
                        // );
                        this.solicitudComp
                          .SendEmailAdmin(
                            data2.ID,
                            this.SelectedStatus.IdStatusSolicitud,
                            this.Direccion.IdDireccion,
                            data2.NombreUsuario,
                            1,
                            this.auth.currentUser.NombreCompleto,
                            this.UserAuth[0].Email
                          )
                          .subscribe(
                            (res) => {
                              
                              this.toast.setMessage(
                                "Error en el envio de el Correo",
                                "warning"
                              );
                              
                            },
                            (error) => {
                              if (error.status == 403 || error.status == 404) {
                                this.toast.setMessage(error.message, "danger");
                                this.auth.logout();
                              }
                              console.log("Error al enviar el correo " + error);
                              this.toast.setMessage(
                                "Envio de Email Correcto",
                                "success"
                              );
                            }
                          );
                      },
                      (error) => {
                        if (error.status == 403 || error.status == 404) {
                          this.toast.setMessage(error.message, "danger");
                          this.auth.logout();
                        }
                        console.log(
                          "error al recuperar la informacion del Autorizador" +
                            error
                        );
                      }
                    );
                },
                (error) => {
                  if (error.status == 403 || error.status == 404) {
                    this.toast.setMessage(error.message, "danger");
                    this.auth.logout();
                  }
                  console.log("error al actualizar como Administrador" + error);
                },
                () => {}
              );
            
          }
        } else {
          //Paso 1 Recuperar Informacion de Solicitud de Pedido y guardarla--------------------------------
          this.solicitudComp
            .getInfoSolPed(this.SelectedStatus.IdSolicitud, data2.Acronimo)
            .subscribe((data) => {
              {
                console.log("getInfoSolPed ================================");
                console.log(data);
                this.ListSap.SOL_TYPE = data2.Acronimo;
                this.ListSap.Item = data;
                //this.MensajeSAP =

                //SERVICIO QUE CREA LA SOLICITUD EM SAP AL MOMENTO DE CAMBIAR EL STATUS DE DICHA SOLICITUD.
                //this.solicitudComp.getInsertinSAP(data2.Id,this.ListSap)
              }
              (error) => {
                if (error.status == 403 || error.status == 404) {
                  this.toast.setMessage(error.message, "danger");
                  this.auth.logout();
                }
                console.log("error al recuperar la info " + error);
              };
            });

          //  //Paso 2 Cambiar el Status de Solicitud-----------
          this.solicitudComp.UpdateStatusSolicitud(
              this.SelectedStatus.IdStatusSolicitud,
              this.SelectedStatus.IdSolicitud,
              this.motivo_Rechazo
            )
            .subscribe(
              (res) => {
                this.toast.setMessage(
                  "Actualizacion de estatus correcta",
                  "success"
                );
                console.log(
                  "se actualozo el status como -----Gerente de Finanzas-----" + res
                );
                this.getAllSolicitudesRegistradasAutAdmin(this.Direccion);
                //Buscamos cual es el Usuario que lleva la Direccion y Autoriza su presupuesto
                this.solicitudComp.getUserAutorizador(this.Direccion.IdDireccion, 1).subscribe(
                    (res) => {
                      //console.log(res);
                      this.UserAuth = res;
                      this.isrechazada = false;
                      this.motivo_Rechazo = '';
                      this.SelectedStatus = undefined;
                      //console.log(this.UserAuth[0]);
                      //Pedimos el usuario creador de la solicitude de pedido para notificarle que ya se envio a SAP la SOLPED
                      //console.log(this.auth.currentUser.Email);
                      // console.log(
                      //   "este es el email del Usaurio Autorizador" +
                      //   this.UserAuth[0].Email
                      // );
                      this.solicitudComp.SendEmailAdmin(
                          data2.ID,
                          this.SelectedStatus.IdStatusSolicitud,
                          this.Direccion.IdDireccion,
                          data2.NombreUsuario,
                          this.auth.currentUser.IdRole,
                          this.auth.currentUser.NombreCompleto,
                          this.UserAuth[0].Email
                        )
                        .subscribe(
                          (res) => {
                            
                            this.toast.setMessage(
                              "Envio de Email Correcto",
                              "success"
                            );
                            console.log(
                              "dento de el metodo para enviar el correo" + res
                            );
                          },
                          (error) => {
                            if (error.status == 403 || error.status == 404) {
                              this.toast.setMessage(error.message, "danger");
                              this.auth.logout();
                            }
                            console.log("Error al enviar el correo " + error);
                            this.toast.setMessage(
                              "Envio de Email Correcto",
                              "success"
                            );
                          }
                        );
                    },
                    (error) => {
                      if (error.status == 403 || error.status == 404) {
                        this.toast.setMessage(error.message, "danger");
                        this.auth.logout();
                      }
                      console.log(
                        "error al recuperar la informacion del Autorizador" +
                          error
                      );
                    }
                  );
              },
              (error) => {
                if (error.status == 403 || error.status == 404) {
                  this.toast.setMessage(error.message, "danger");
                  this.auth.logout();
                }
                console.log("error al actualizar como Administrador" + error);
              },
              () => {}
            );
        }
      } else {
        this.toast.setMessage(
          "No tienes permisos para cambiar a este Status",
          "warning"
        );
      }
    } 

    if (this.auth.isCompras) {
      //solo valida el estatus que se seleciono y si correcponde a alguno de los 2 que tiene permitido pasa a actualizar
      //dicha solicitud a estatus autorizado por Compras despues refresca las solicitudes y los campos.
      console.log(this.SelectedStatus.IdStatusSolicitud)
      if (
        this.SelectedStatus.IdStatusSolicitud == 8 ||//S. P. REVISADA POR COMPRAS
        this.SelectedStatus.IdStatusSolicitud == 9 ||//S. P. RECHAZADA POR COMPRAS
        this.SelectedStatus.IdStatusSolicitud == 14||//CONTRATO MARCO
        this.SelectedStatus.IdStatusSolicitud == 15 //INTERCAMBIOS
      ) {
        console.log(data2);
        console.log(this.motivo_Rechazo);
        if ( this.SelectedStatus.IdStatusSolicitud == 9) {
          const lengRechazo = (this.motivo_Rechazo || '').trim();
          if(lengRechazo.length === 0){
            this.toast.setMessage("No se puede Rechazar una Solicitud sin un motivo de rechazo, favor de validar la informacion","danger");
          }else{
            this.SelectedStatus.IdSolicitud = data2.ID;
            this.solicitudComp
              .UpdateStatusSolicitud(
                this.SelectedStatus.IdStatusSolicitud,
                this.SelectedStatus.IdSolicitud,
                this.motivo_Rechazo
              )
              .subscribe(
                (data) => {
                  console.log(data);
                  this.getAllSolicitudesRegistradasporUsrCompras(this.Direccion,this.SelectedCompras);
                  this.isrechazada = false;
                  this.motivo_Rechazo = '';
                  this.SelectedStatus = undefined;
                  // this.getDireccionesforUser(this.auth.currentUser.IdUsuario);
                  // this.getStatusCompras(this.auth.currentUser.IdRole, 1);
                  
                  this.SelectedStatus = new StatusSolicitud();
                  this.toast.setMessage(
                    "Actualizacion de estatus correcta",
                    "success"
                  );
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
        } else {
          this.SelectedStatus.IdSolicitud = data2.ID;
          this.solicitudComp
            .UpdateStatusSolicitud(
              this.SelectedStatus.IdStatusSolicitud,
              this.SelectedStatus.IdSolicitud,
              this.motivo_Rechazo
            )
            .subscribe(
              (data) => {
                console.log(data);
                this.getAllSolicitudesRegistradasporUsrCompras(
                  this.Direccion,
                  this.SelectedCompras
                );
                // this.getDireccionesforUser(this.auth.currentUser.IdUsuario);
                // this.getStatusCompras(this.auth.currentUser.IdRole, 1);
                this.isrechazada = false;
                this.motivo_Rechazo = '';
                this.SelectedStatus = undefined;
                this.toast.setMessage(
                  "Actualizacion de estatus correcta",
                  "success"
                );
              },
              (error) => {
                if (error.status == 403 || error.status == 404) {
                  this.toast.setMessage(error.message, "danger");
                  this.auth.logout();
                }
                this.isrechazada = false;
                this.motivo_Rechazo = '';
                this.SelectedStatus = undefined;
                console.log(error);
              }
            );
        }
      }
    } 

    if(this.auth.isComprador){
      if (
        this.SelectedStatus.IdStatusSolicitud == 8 ||//S. P. REVISADA POR COMPRAS
        this.SelectedStatus.IdStatusSolicitud == 9 ||//S. P. RECHAZADA POR COMPRAS
        this.SelectedStatus.IdStatusSolicitud == 14||//CONTRATO MARCO
        this.SelectedStatus.IdStatusSolicitud == 15 //INTERCAMBIOS
      ) {
        console.log(data2);
        console.log(this.motivo_Rechazo);
        if (this.SelectedStatus.IdStatusSolicitud == 9  ) {
          const lengRechazo = (this.motivo_Rechazo || '').trim();
          if(lengRechazo.length === 0){
            this.toast.setMessage("No se puede Rechazar una Solicitud sin un motivo de rechazo, favor de validar la informacion","danger");
          }else{
            this.SelectedStatus.IdSolicitud = data2.ID;
            this.solicitudComp
              .UpdateStatusSolicitud(
                this.SelectedStatus.IdStatusSolicitud,
                this.SelectedStatus.IdSolicitud,
                this.motivo_Rechazo
              )
              .subscribe(
                (data) => {
                  console.log(data);
                  this.getAllSolicitudesRegistradasporUsrComprador(
                    this.Direccion,
                    this.SelectedCompras,
                    this.auth.currentUser.IdUsuario
                  );
                  // this.getDireccionesforUser(this.auth.currentUser.IdUsuario);
                  // this.getStatusCompras(this.auth.currentUser.IdRole, 1);
                  this.isrechazada = false;
                  this.motivo_Rechazo = '';
                  this.SelectedStatus = undefined;
                  this.toast.setMessage(
                    "Actualizacion de estatus correcta",
                    "success"
                  );
                },
                (error) => {
                  if (error.status == 403 || error.status == 404) {
                    this.toast.setMessage(error.message, "danger");
                    this.auth.logout();
                  }
                  this.isrechazada = false;
                  this.motivo_Rechazo = '';
                  this.SelectedStatus = undefined;
                  console.log(error);
                }
              );
          }
        } else {
          this.SelectedStatus.IdSolicitud = data2.ID;
          this.solicitudComp
            .UpdateStatusSolicitud(
              this.SelectedStatus.IdStatusSolicitud,
              this.SelectedStatus.IdSolicitud,
              this.motivo_Rechazo
            )
            .subscribe(
              (data) => {
                console.log(data);
                this.getAllSolicitudesRegistradasporUsrComprador(
                  this.Direccion,
                  this.SelectedCompras,
                  this.auth.currentUser.IdUsuario
                );
                // this.getDireccionesforUser(this.auth.currentUser.IdUsuario);
                // this.getStatusCompras(this.auth.currentUser.IdRole, 1);
                this.isrechazada = false;
                this.motivo_Rechazo = '';
                this.SelectedStatus = undefined;
                //this.SelectedStatus = new StatusSolicitud();
                this.toast.setMessage(
                  "Actualizacion de estatus correcta",
                  "success"
                );
              },
              (error) => {
                if (error.status == 403 || error.status == 404) {
                  this.toast.setMessage(error.message, "danger");
                  this.auth.logout();
                }
                this.isrechazada = false;
                this.motivo_Rechazo = '';
                this.SelectedStatus = undefined;
                console.log(error);
              }
            );
        }
      }
    }
  }

  validaDatosgerente() {
    if (
      this.SelectedImputacion === undefined ||
      this.SelectedPosicion === undefined
    ) {
      this.toast.setMessage(
        "Los Campos de Usuario y Datos Generales son rqueridos, Revisar Informacion",
        "warning"
      );
    } else {
      console.log(this.SelectedImputacion.Nombre);
      console.log(this.SelectedPosicion.Nombre);
    }
  }

  async changedCategorySol(sol:SolicitudesCompraRegistradas){
    console.log(sol.ID);
    console.log(this.SelectCategory.IdCategoria);
    try {
      let message = await this.solicitudComp.changedcategoryforsolicitud(sol.ID, this.SelectCategory.IdCategoria);
      if(message != undefined){
        this.toast.setMessage(message,"success");
        this.getAllSolicitudesRegistradasporUsrCompras(
          this.Direccion,
          this.SelectedCompras
        );
        this.getAllCategorias();
      }
    } catch (error) {
      if (error.status == 403 || error.status == 404) {
        this.toast.setMessage(error.message,"danger");
        this.auth.logout();
      }else{
        this.toast.setMessage(error.message,"danger");
      }
    }
  }

  historyforSolicitud(element:SolicitudesCompraRegistradas){
    console.log(element);
  }

  // async verPDF(ruta: any) {
  //   console.log(ruta.RutaCotizacion);
  //   //window.open(ruta, null);
  //   //this.pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  //   this.pdfSrc = "http://solicitud.adgimm.com.mx:3000/public/ 111.txt";
  //   // // location.href = this.pdfSrc;
  //   window.open(this.pdfSrc, null);

  //   // var nameCotizacion = this.pdfSrc;
  //   // this.solicitudComp.downloadCotizacion(nameCotizacion);
  //   // .subscribe(data =>{
  //   //   console.log(data);
  //   // });
  // }
}
