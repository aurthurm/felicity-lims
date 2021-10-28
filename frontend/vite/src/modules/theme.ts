import { toRefs, reactive } from 'vue';
import { useStore } from 'vuex';

export default function themify(){
    const store = useStore();

    const state = reactive({
        accent: {},
        background: {},
        button: {},
    });

    changeTheme("default")

    function changeTheme(theme: string = "light"): void {
        switch (theme){
            case "light":
                setLightTheme()
            case "dark":
                setDarkTheme()
            default:
                setDefault()
        }
    }    

    const setLightTheme = () => {}  

    const setDarkTheme = () => {} 

    const setDefault = () => {}  // black and white

    return {
      ...toRefs(state),
      changeTheme
    }
}
