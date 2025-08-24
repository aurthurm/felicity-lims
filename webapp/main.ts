import { createApp } from 'vue';
import { registerLicenses, registerComponents, registerPlugins } from './registry';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faAnchor,
    faArrowDown,
    faArrowDownWideShort,
    faArrowUpWideShort,
    faAsterisk,
    faBacteria,
    faBan,
    faBarcode,
    faBars,
    faBell,
    faBoxesStacked,
    faBullseye,
    faCaravan,
    faCartShopping,
    faCheckCircle,
    faChevronCircleLeft,
    faChevronCircleRight,
    faChevronDown,
    faChevronUp,
    faCircleDot,
    faClinicMedical,
    faCodeBranch,
    faCog,
    faColumns,
    faCompress,
    faCopy,
    faDatabase,
    faDeleteLeft,
    faDownload,
    faEdit,
    faEllipsis,
    faEllipsisH,
    faExclamationCircle,
    faExpand,
    faFile,
    faFileMedical,
    faFill,
    faFlag,
    faGripHorizontal,
    faGripVertical,
    faInfo,
    faInfoCircle,
    faLaptopMedical,
    faLeftRight,
    faLevelDownAlt,
    faLifeRing,
    faMeteor,
    faMicroscope,
    faMoneyBill,
    faPen,
    faPills,
    faProjectDiagram,
    faQuestion,
    faRobot,
    faScaleBalanced,
    faShuffle,
    faSignOutAlt,
    faSort,
    faStar,
    faTablets,
    faTachometerAlt,
    faTh,
    faThList,
    faThumbsDown,
    faThumbsUp,
    faTimes,
    faTimesCircle,
    faTrash,
    faTrashAlt,
    faTruck,
    faUser,
    faUserInjured,
    faUsers,
    faVial
} from '@fortawesome/free-solid-svg-icons';

import 'vue-multiselect/dist/vue-multiselect.css';
import 'floating-vue/dist/style.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'notyf/notyf.min.css';
import '@vuepic/vue-datepicker/dist/main.css'
import '@/index.css';
import '@/assets/css/style.css';
import '@/assets/css/ckeditor.css';

import App from './App.vue';

const icons = [
    faBell, faCog, faUser, faChevronDown, faBars, faMeteor, faTachometerAlt, faBullseye,
    faUserInjured, faClinicMedical, faVial, faGripVertical, faDatabase, faTruck, faBoxesStacked,
    faFlag, faFileMedical, faUsers, faCaravan, faLaptopMedical, faFill, faMicroscope, faGripHorizontal,
    faCopy, faCodeBranch, faMoneyBill, faEdit, faLeftRight, faSort, faTimes, faEllipsis, faBarcode,
    faCheckCircle, faTimesCircle, faThumbsDown, faThumbsUp, faQuestion, faDownload, faBan, faCartShopping,
    faInfoCircle, faAnchor, faThList, faTh, faInfo, faTrash, faAsterisk, faArrowUpWideShort, faArrowDownWideShort,
    faArrowDown, faLevelDownAlt, faPen, faDeleteLeft, faEllipsisH, faTablets, faScaleBalanced, faLifeRing,
    faBacteria, faCircleDot, faPills, faExclamationCircle, faRobot, faProjectDiagram, faFile, faStar,
    faColumns, faTrashAlt, faChevronUp, faSignOutAlt, faExpand, faCompress, faShuffle, faChevronCircleLeft,
    faChevronCircleRight
]
library.add(...icons);

registerLicenses();
const app = createApp(App);
registerComponents(app);
registerPlugins(app);
app.mount('#felicityApp');


// https://enterprisevue.dev/blog/error-handling-in-vue-3/
// https://medium.com/@dillonchanis/handling-errors-in-vue-with-error-boundaries-91f6ead0093b