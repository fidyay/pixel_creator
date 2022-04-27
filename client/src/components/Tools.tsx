import React, { useState } from "react";
import Button from "./Button";
import ColorPicker from "./ColorPicker";
import type { PenSizeType, BrushType} from "./Workplace";


interface ToolsProps {
    chosenPenSize: PenSizeType,
    setChosenPenSize: React.Dispatch<React.SetStateAction<PenSizeType>>,
    chosenBrush: BrushType,
    setChosenBrush: React.Dispatch<React.SetStateAction<BrushType>>,
    setChosenColor: React.Dispatch<React.SetStateAction<string>>
}

const Tools = ({chosenPenSize, setChosenPenSize, chosenBrush, setChosenBrush, setChosenColor}: ToolsProps) => {

    return (
        <div className="main__tools tools">
            <h3 className="tools__heading">Pen sizes</h3>
            <div className="tools__pen-sizes">
                <Button chosen={chosenPenSize === 1} onClick={() => setChosenPenSize(1)} transparent className="tools__pen-size">1</Button>
                <Button chosen={chosenPenSize === 2} onClick={() => setChosenPenSize(2)} transparent className="tools__pen-size">2</Button>
                <Button chosen={chosenPenSize === 3} onClick={() => setChosenPenSize(3)} transparent className="tools__pen-size">3</Button>
                <Button chosen={chosenPenSize === 4} onClick={() => setChosenPenSize(4)} transparent className="tools__pen-size">4</Button>
            </div>
            <div className="tools__pens">
                <Button chosen={chosenBrush === 'pen'} onClick={() => setChosenBrush('pen')} transparent className="tools__pen">
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.4333 15.0333L24.9667 16.5667L9.86667 31.6667H8.33333V30.1333L23.4333 15.0333ZM29.4333 5C29.0167 5 28.5833 5.16667 28.2667 5.48333L25.2167 8.53333L31.4667 14.7833L34.5167 11.7333C35.1667 11.0833 35.1667 10.0333 34.5167 9.38333L30.6167 5.48333C30.2833 5.15 29.8667 5 29.4333 5ZM23.4333 10.3167L5 28.75V35H11.25L29.6833 16.5667L23.4333 10.3167Z" fill="#6969B3"/>
                    </svg>
                </Button>
                <Button chosen={chosenBrush === 'line'} onClick={() => setChosenBrush('line')} transparent className="tools__pen">
                    <svg viewBox="0 0 34 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24.6833 11.5667L18.4333 5.31668L3.33331 20.4167V26.6667H9.58331L24.6833 11.5667ZM6.66665 23.3333V21.8L18.4333 10.0333L19.9666 11.5667L8.19998 23.3333H6.66665Z" fill="#6969B3"/>
                        <path d="M29.5167 6.73333C30.1667 6.08333 30.1667 5.03333 29.5167 4.38333L25.6167 0.483333C25.2833 0.15 24.8667 0 24.4333 0C24.0167 0 23.5833 0.166667 23.2667 0.483333L20.2167 3.53333L26.4667 9.78333L29.5167 6.73333Z" fill="#6969B3"/>
                        <path d="M33.3333 30H0V36.6667H33.3333V30Z" fill="#6969B3"/>
                    </svg>
                </Button>
                <Button chosen={chosenBrush === 'paint_bucket'} onClick={() => setChosenBrush('paint_bucket')} transparent className="tools__pen">
                    <svg viewBox="0 0 34 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24.2667 14.9L9.36667 0L7.01667 2.35L10.9833 6.31667L2.4 14.9C1.41667 15.8833 1.41667 17.4667 2.4 18.4333L11.5667 27.6C12.05 28.0833 12.7 28.3333 13.3333 28.3333C13.9667 28.3333 14.6167 28.0833 15.1 27.6L24.2667 18.4333C25.25 17.4667 25.25 15.8833 24.2667 14.9ZM5.35 16.6667L13.3333 8.68333L21.3167 16.6667H5.35ZM28.3333 19.1667C28.3333 19.1667 25 22.7833 25 25C25 26.8333 26.5 28.3333 28.3333 28.3333C30.1667 28.3333 31.6667 26.8333 31.6667 25C31.6667 22.7833 28.3333 19.1667 28.3333 19.1667ZM0 33.3333H33.3333V40H0V33.3333Z" fill="#6969B3"/>
                    </svg>
                </Button>
                <Button chosen={chosenBrush === 'eraser'} onClick={() => setChosenBrush('eraser')} transparent className="tools__pen">
                    <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="path-1-inside-1_101_273" fill="white">
                            <path d="M20.8213 22.719C20.8285 22.7109 20.8348 22.7023 20.8415 22.6941L28.9466 13.6617C29.6264 12.9042 30.0006 11.8952 30 10.8206C29.9994 9.74752 29.6251 8.74084 28.9466 7.98674L22.8314 1.17109C22.1531 0.415873 21.2485 0 20.2845 0C19.3204 0 18.4161 0.416012 17.7382 1.1713L1.05344 19.7582C0.373375 20.5159 -0.000748873 21.5259 1.12544e-06 22.6021C0.000813624 23.6763 0.375125 24.6831 1.05337 25.4363L4.96537 29.796C4.96918 29.8003 4.9733 29.8038 4.97712 29.8079C4.98799 29.8194 4.99893 29.831 5.01049 29.8416C5.01561 29.8462 5.02118 29.8503 5.02643 29.8548C5.03736 29.8642 5.04824 29.8737 5.05968 29.8823C5.06405 29.8856 5.06874 29.8882 5.07311 29.8914C5.08593 29.9005 5.09886 29.9095 5.1123 29.9175C5.11549 29.9194 5.11874 29.9209 5.12193 29.9227C5.13686 29.9313 5.15205 29.9395 5.16768 29.9468C5.16974 29.9478 5.17186 29.9485 5.17399 29.9494C5.1908 29.9569 5.20774 29.9639 5.22518 29.9698C5.2273 29.9705 5.22955 29.971 5.23168 29.9717C5.24893 29.9773 5.26643 29.9824 5.28424 29.9863C5.28936 29.9875 5.29455 29.988 5.29968 29.989C5.31461 29.9918 5.32961 29.9948 5.34493 29.9964C5.36555 29.9987 5.38636 30 5.4073 30H23.9834C24.3285 30 24.6084 29.6882 24.6084 29.3036C24.6084 28.9191 24.3285 28.6073 23.9834 28.6073H15.5353L20.7991 22.7413C20.8065 22.7339 20.8141 22.7269 20.8213 22.719ZM13.7678 28.6073H5.66624L1.93656 24.4508C1.49431 23.9595 1.2505 23.3027 1.25 22.601C1.2495 21.8972 1.49356 21.2374 1.93725 20.743L10.0513 11.7039L19.4945 22.2254L13.7678 28.6073ZM10.9353 10.7192L18.622 2.1561C19.0638 1.66384 19.6543 1.39267 20.2845 1.39267C20.9148 1.39267 21.5055 1.66391 21.9476 2.15603L28.0632 8.97211C28.5057 9.46396 28.7496 10.1206 28.75 10.8215C28.7504 11.5238 28.5063 12.1827 28.0626 12.6769L20.3783 21.2405L10.9353 10.7192Z"/>
                        </mask>
                        <path d="M20.8213 22.719C20.8285 22.7109 20.8348 22.7023 20.8415 22.6941L28.9466 13.6617C29.6264 12.9042 30.0006 11.8952 30 10.8206C29.9994 9.74752 29.6251 8.74084 28.9466 7.98674L22.8314 1.17109C22.1531 0.415873 21.2485 0 20.2845 0C19.3204 0 18.4161 0.416012 17.7382 1.1713L1.05344 19.7582C0.373375 20.5159 -0.000748873 21.5259 1.12544e-06 22.6021C0.000813624 23.6763 0.375125 24.6831 1.05337 25.4363L4.96537 29.796C4.96918 29.8003 4.9733 29.8038 4.97712 29.8079C4.98799 29.8194 4.99893 29.831 5.01049 29.8416C5.01561 29.8462 5.02118 29.8503 5.02643 29.8548C5.03736 29.8642 5.04824 29.8737 5.05968 29.8823C5.06405 29.8856 5.06874 29.8882 5.07311 29.8914C5.08593 29.9005 5.09886 29.9095 5.1123 29.9175C5.11549 29.9194 5.11874 29.9209 5.12193 29.9227C5.13686 29.9313 5.15205 29.9395 5.16768 29.9468C5.16974 29.9478 5.17186 29.9485 5.17399 29.9494C5.1908 29.9569 5.20774 29.9639 5.22518 29.9698C5.2273 29.9705 5.22955 29.971 5.23168 29.9717C5.24893 29.9773 5.26643 29.9824 5.28424 29.9863C5.28936 29.9875 5.29455 29.988 5.29968 29.989C5.31461 29.9918 5.32961 29.9948 5.34493 29.9964C5.36555 29.9987 5.38636 30 5.4073 30H23.9834C24.3285 30 24.6084 29.6882 24.6084 29.3036C24.6084 28.9191 24.3285 28.6073 23.9834 28.6073H15.5353L20.7991 22.7413C20.8065 22.7339 20.8141 22.7269 20.8213 22.719ZM13.7678 28.6073H5.66624L1.93656 24.4508C1.49431 23.9595 1.2505 23.3027 1.25 22.601C1.2495 21.8972 1.49356 21.2374 1.93725 20.743L10.0513 11.7039L19.4945 22.2254L13.7678 28.6073ZM10.9353 10.7192L18.622 2.1561C19.0638 1.66384 19.6543 1.39267 20.2845 1.39267C20.9148 1.39267 21.5055 1.66391 21.9476 2.15603L28.0632 8.97211C28.5057 9.46396 28.7496 10.1206 28.75 10.8215C28.7504 11.5238 28.5063 12.1827 28.0626 12.6769L20.3783 21.2405L10.9353 10.7192Z" fill="#6969B3"/>
                        <path d="M20.8213 22.719L23.0453 24.7325L23.054 24.7228L20.8213 22.719ZM20.8415 22.6941L18.6087 20.6905L18.5649 20.7392L18.5234 20.7898L20.8415 22.6941ZM28.9466 13.6617L26.7139 11.6579L26.7137 11.6581L28.9466 13.6617ZM30 10.8206L33 10.819L33 10.8188L30 10.8206ZM28.9466 7.98674L26.7137 9.99023L26.7164 9.99322L28.9466 7.98674ZM22.8314 1.17109L25.0643 -0.832392L25.0633 -0.833551L22.8314 1.17109ZM17.7382 1.1713L19.9707 3.17531L19.9709 3.17511L17.7382 1.1713ZM1.05344 19.7582L-1.17904 17.7542L-1.17921 17.7544L1.05344 19.7582ZM1.12544e-06 22.6021L-3 22.6042L-3 22.6044L1.12544e-06 22.6021ZM1.05337 25.4363L3.28625 23.4328L3.28271 23.4288L1.05337 25.4363ZM4.96537 29.796L2.7325 31.7996L2.73272 31.7998L4.96537 29.796ZM4.97712 29.8079L2.77803 31.8485L2.7881 31.8594L2.79827 31.8701L4.97712 29.8079ZM5.01049 29.8416L2.98478 32.0544L2.99091 32.06L5.01049 29.8416ZM5.02643 29.8548L6.98192 27.5797L6.97494 27.5737L6.96793 27.5678L5.02643 29.8548ZM5.05968 29.8823L3.25205 32.2766L3.2626 32.2845L5.05968 29.8823ZM5.07311 29.8914L3.32619 32.3303L3.3331 32.3352L5.07311 29.8914ZM5.1123 29.9175L3.56665 32.4887L3.59839 32.5078L3.63059 32.5261L5.1123 29.9175ZM5.12193 29.9227L6.61425 27.3202L6.60364 27.3142L5.12193 29.9227ZM5.16768 29.9468L6.44974 27.2345L6.43922 27.2296L5.16768 29.9468ZM5.17399 29.9494L6.39901 27.2109L6.3745 27.1999L6.34979 27.1894L5.17399 29.9494ZM5.22518 29.9698L6.24252 27.1475L6.21609 27.138L6.18948 27.129L5.22518 29.9698ZM5.23168 29.9717L4.29745 32.8225L4.29928 32.8231L5.23168 29.9717ZM5.28424 29.9863L5.95944 27.0633L5.9481 27.0607L5.93675 27.0582L5.28424 29.9863ZM5.29968 29.989L4.70055 32.9286L4.71848 32.9322L4.73646 32.9357L5.29968 29.989ZM5.34493 29.9964L5.67713 27.0149L5.66708 27.0138L5.65702 27.0127L5.34493 29.9964ZM15.5353 28.6073L13.3025 26.6036L8.81258 31.6073H15.5353V28.6073ZM20.7991 22.7413L18.6669 20.6309L18.6153 20.6831L18.5662 20.7377L20.7991 22.7413ZM13.7678 28.6073V31.6073H15.1065L16.0006 30.6109L13.7678 28.6073ZM5.66624 28.6073L3.43336 30.6109L4.32746 31.6073H5.66624V28.6073ZM1.93656 24.4508L4.16944 22.4472L4.1661 22.4435L1.93656 24.4508ZM1.25 22.601L-1.75 22.6031L-1.75 22.6031L1.25 22.601ZM1.93725 20.743L-0.295231 18.739L-0.295399 18.7392L1.93725 20.743ZM10.0513 11.7039L12.2839 9.70008L10.0515 7.21269L7.81881 9.6999L10.0513 11.7039ZM19.4945 22.2254L21.7273 24.229L23.5254 22.2252L21.7271 20.2216L19.4945 22.2254ZM10.9353 10.7192L8.70281 8.71515L6.90404 10.719L8.70264 12.723L10.9353 10.7192ZM18.622 2.1561L20.8545 4.16011L20.8547 4.15992L18.622 2.1561ZM21.9476 2.15603L24.1805 0.152554L24.1794 0.151272L21.9476 2.15603ZM28.0632 8.97211L25.8302 10.9756L25.8329 10.9786L28.0632 8.97211ZM28.75 10.8215L31.75 10.8199L31.75 10.8196L28.75 10.8215ZM28.0626 12.6769L25.8301 10.673L25.8298 10.6733L28.0626 12.6769ZM20.3783 21.2405L18.1456 23.2443L20.3785 25.7322L22.6111 23.2441L20.3783 21.2405ZM23.054 24.7228C23.1227 24.6462 23.1734 24.5818 23.1865 24.5653C23.1904 24.5603 23.1937 24.556 23.1944 24.5552C23.1959 24.5533 23.1944 24.5552 23.1927 24.5574C23.1891 24.5619 23.1766 24.5778 23.1597 24.5983L18.5234 20.7898C18.5031 20.8145 18.4872 20.8346 18.4804 20.8433C18.477 20.8475 18.4739 20.8516 18.4737 20.8517C18.4728 20.853 18.4745 20.8508 18.4767 20.8479C18.4812 20.8423 18.4944 20.8256 18.512 20.8042C18.5302 20.7822 18.5562 20.7513 18.5887 20.7151L23.054 24.7228ZM23.0744 24.6977L31.1794 15.6654L26.7137 11.6581L18.6087 20.6905L23.0744 24.6977ZM31.1792 15.6656C32.3829 14.3245 33.0009 12.5887 33 10.819L27 10.8221C27.0002 11.2017 26.87 11.484 26.7139 11.6579L31.1792 15.6656ZM33 10.8188C32.999 9.05188 32.3807 7.31831 31.1769 5.98027L26.7164 9.99322C26.8695 10.1634 26.9998 10.4432 27 10.8223L33 10.8188ZM31.1796 5.98327L25.0643 -0.832392L20.5984 3.17457L26.7137 9.99022L31.1796 5.98327ZM25.0633 -0.833551C23.85 -2.1844 22.1496 -3 20.2845 -3V3C20.3474 3 20.4561 3.01614 20.5995 3.17572L25.0633 -0.833551ZM20.2845 -3C18.4189 -3 16.7185 -2.18395 15.5056 -0.832524L19.9709 3.17511C20.1137 3.01598 20.2219 3 20.2845 3V-3ZM15.5057 -0.832715L-1.17904 17.7542L3.28591 21.7622L19.9707 3.17531L15.5057 -0.832715ZM-1.17921 17.7544C-2.38379 19.0965 -3.00123 20.8336 -3 22.6042L3 22.6C2.99973 22.2181 3.13054 21.9353 3.28608 21.762L-1.17921 17.7544ZM-3 22.6044C-2.99866 24.3711 -2.38106 26.1056 -1.17596 27.4438L3.28271 23.4288C3.13131 23.2607 3.00029 22.9814 3 22.5998L-3 22.6044ZM-1.17949 27.4399L2.7325 31.7996L7.19823 27.7925L3.28624 23.4328L-1.17949 27.4399ZM2.73272 31.7998C2.77409 31.8459 2.80968 31.8828 2.83409 31.9075C2.84638 31.9199 2.85673 31.9302 2.86398 31.9373C2.87099 31.9442 2.87662 31.9497 2.87832 31.9514C2.88211 31.9551 2.87816 31.9512 2.87655 31.9497C2.87354 31.9467 2.86702 31.9403 2.85872 31.9321C2.84238 31.9158 2.81328 31.8865 2.77803 31.8485L7.1762 27.7673C7.13905 27.7273 7.108 27.696 7.08969 27.6778C7.08041 27.6686 7.07291 27.6612 7.0689 27.6573C7.06686 27.6553 7.06521 27.6537 7.06451 27.653C7.06432 27.6528 7.06415 27.6527 7.06404 27.6526C7.06399 27.6525 7.06394 27.6525 7.0639 27.6524C7.06386 27.6524 7.06385 27.6524 7.06383 27.6524C7.06374 27.6523 7.06391 27.6524 7.06416 27.6527C7.06487 27.6534 7.0695 27.6579 7.07553 27.6638C7.08179 27.67 7.09115 27.6793 7.10246 27.6907C7.1249 27.7134 7.15855 27.7482 7.19801 27.7922L2.73272 31.7998ZM2.79827 31.8701C2.80049 31.8725 2.8242 31.8976 2.85142 31.9254C2.88058 31.9551 2.92664 32.0011 2.98478 32.0544L7.0362 27.6288C7.08278 27.6714 7.11759 27.7063 7.13567 27.7248C7.15181 27.7412 7.16462 27.7549 7.15596 27.7457L2.79827 31.8701ZM2.99091 32.06C3.02939 32.095 3.06248 32.1233 3.08623 32.1433C3.10938 32.1627 3.12803 32.1778 3.13505 32.1834C3.13831 32.186 3.14193 32.189 3.14105 32.1883C3.14105 32.1882 3.14087 32.1881 3.14061 32.1879C3.14034 32.1877 3.13992 32.1873 3.13939 32.1869C3.13835 32.1861 3.13669 32.1847 3.13462 32.1831C3.12716 32.177 3.10855 32.1619 3.08493 32.1418L6.96793 27.5678C6.94168 27.5455 6.9204 27.5282 6.91026 27.52C6.90509 27.5158 6.90084 27.5124 6.89981 27.5115C6.89759 27.5097 6.89986 27.5116 6.90178 27.5131C6.9061 27.5166 6.92207 27.5295 6.94258 27.5467C6.96368 27.5644 6.99416 27.5905 7.03007 27.6232L2.99091 32.06ZM3.07093 32.1299C3.07166 32.1305 3.07149 32.1304 3.07402 32.1326C3.07581 32.1341 3.07892 32.1368 3.08251 32.1398C3.08958 32.1459 3.10147 32.1561 3.11592 32.1682C3.14416 32.1918 3.19179 32.2311 3.25206 32.2766L6.86729 27.488C6.91612 27.5249 6.9526 27.5551 6.96981 27.5695C6.97874 27.577 6.98515 27.5825 6.98675 27.5839C6.98761 27.5846 6.98798 27.5849 6.98703 27.5841C6.98683 27.5839 6.98393 27.5814 6.98192 27.5797L3.07093 32.1299ZM3.2626 32.2845C3.31349 32.3226 3.35665 32.3524 3.38579 32.372C3.41353 32.3907 3.43607 32.4052 3.43956 32.4075C3.44056 32.4081 3.44204 32.4091 3.4415 32.4087C3.44149 32.4087 3.44033 32.408 3.43877 32.407C3.43574 32.405 3.42857 32.4004 3.41936 32.3943C3.4014 32.3825 3.36772 32.36 3.3262 32.3303L6.82003 27.4525C6.77633 27.4211 6.74041 27.3972 6.72021 27.3839C6.70987 27.3771 6.70157 27.3717 6.69742 27.369C6.69529 27.3676 6.69356 27.3665 6.693 27.3661C6.69188 27.3654 6.69279 27.366 6.69324 27.3663C6.69451 27.3671 6.7002 27.3708 6.70763 27.3756C6.71529 27.3807 6.72659 27.3881 6.74022 27.3973C6.76712 27.4154 6.80805 27.4437 6.85676 27.4801L3.2626 32.2845ZM3.3331 32.3352C3.35719 32.3524 3.44848 32.4177 3.56665 32.4887L6.65796 27.3464C6.70698 27.3758 6.74559 27.4012 6.77035 27.4179C6.79438 27.4341 6.8114 27.4463 6.81313 27.4475L3.3331 32.3352ZM3.63059 32.5261C3.66315 32.5446 3.69002 32.5591 3.70692 32.568C3.71549 32.5726 3.72253 32.5763 3.72697 32.5786C3.72923 32.5798 3.73109 32.5808 3.7323 32.5814C3.73343 32.582 3.73442 32.5825 3.73449 32.5825C3.73541 32.583 3.73266 32.5816 3.72938 32.5799C3.72575 32.578 3.71952 32.5747 3.71174 32.5706C3.69645 32.5624 3.67118 32.5488 3.64022 32.5313L6.60364 27.3142C6.57108 27.2957 6.54421 27.2812 6.52731 27.2722C6.51874 27.2677 6.5117 27.264 6.50726 27.2616C6.505 27.2605 6.50314 27.2595 6.50193 27.2589C6.5008 27.2583 6.49981 27.2578 6.49974 27.2577C6.49882 27.2572 6.50157 27.2587 6.50485 27.2604C6.50848 27.2623 6.51471 27.2656 6.52249 27.2697C6.53778 27.2778 6.56305 27.2914 6.59401 27.309L3.63059 32.5261ZM3.62962 32.5252C3.68457 32.5567 3.77811 32.6088 3.89613 32.664L6.43922 27.2296C6.526 27.2702 6.58916 27.3058 6.61424 27.3202L3.62962 32.5252ZM3.88562 32.6591C3.94072 32.6851 3.98742 32.7051 4.02052 32.7188C4.05254 32.7321 4.07788 32.742 4.08569 32.745C4.08882 32.7462 4.0938 32.7481 4.09079 32.747C4.08991 32.7466 4.08452 32.7445 4.07758 32.7418C4.06388 32.7364 4.03479 32.7249 3.99819 32.7094L6.34979 27.1894C6.31213 27.1733 6.28197 27.1614 6.26721 27.1556C6.25974 27.1527 6.25382 27.1504 6.25241 27.1499C6.24888 27.1485 6.25333 27.1502 6.25593 27.1512C6.26268 27.1539 6.28698 27.1633 6.31795 27.1761C6.35 27.1894 6.39567 27.209 6.44973 27.2345L3.88562 32.6591ZM3.94897 32.6879C4.01915 32.7193 4.12713 32.7652 4.26087 32.8106L6.18948 27.129C6.28835 27.1625 6.36246 27.1945 6.39901 27.2109L3.94897 32.6879ZM4.20783 32.792C4.28405 32.8195 4.34763 32.8389 4.38953 32.8511C4.42957 32.8627 4.4616 32.8711 4.46614 32.8723C4.46762 32.8727 4.46935 32.8731 4.4686 32.8729C4.4685 32.8729 4.46668 32.8724 4.46435 32.8718C4.4598 32.8706 4.44919 32.8678 4.43566 32.8641C4.40943 32.8569 4.35951 32.8428 4.29745 32.8225L6.16591 27.1208C6.10278 27.1001 6.05179 27.0858 6.02447 27.0783C6.01039 27.0744 5.99924 27.0714 5.99415 27.0701C5.99154 27.0694 5.98944 27.0689 5.98907 27.0688C5.98805 27.0685 5.98951 27.0689 5.99071 27.0692C5.99342 27.0699 6.00245 27.0723 6.01406 27.0754C6.026 27.0787 6.04327 27.0835 6.06405 27.0895C6.10486 27.1014 6.16737 27.1204 6.24252 27.1475L4.20783 32.792ZM4.29928 32.8231C4.3778 32.8488 4.49241 32.8835 4.63173 32.9145L5.93675 27.0582C6.04045 27.0813 6.12006 27.1058 6.16407 27.1202L4.29928 32.8231ZM4.60904 32.9094C4.67984 32.9257 4.73879 32.9367 4.77841 32.9435C4.81617 32.95 4.84643 32.9545 4.85133 32.9552C4.85283 32.9554 4.85465 32.9557 4.85409 32.9556C4.85406 32.9556 4.85368 32.9555 4.85314 32.9555C4.85258 32.9554 4.85171 32.9552 4.85063 32.9551C4.84672 32.9545 4.83727 32.9531 4.8251 32.9511C4.80133 32.9474 4.75657 32.94 4.70055 32.9286L5.89881 27.0494C5.84022 27.0375 5.79289 27.0297 5.76655 27.0255C5.75309 27.0233 5.74235 27.0217 5.73715 27.0209C5.7345 27.0205 5.73234 27.0202 5.73176 27.0201C5.73055 27.02 5.73173 27.0201 5.73259 27.0203C5.73464 27.0206 5.74255 27.0217 5.75286 27.0233C5.76348 27.025 5.779 27.0275 5.79778 27.0307C5.83482 27.0371 5.8912 27.0476 5.95944 27.0633L4.60904 32.9094ZM4.73646 32.9357C4.72684 32.9338 4.7695 32.9421 4.8098 32.9491C4.85707 32.9573 4.93572 32.97 5.03284 32.9802L5.65702 27.0127C5.73882 27.0213 5.80232 27.0317 5.83453 27.0373C5.85105 27.0401 5.86329 27.0424 5.86738 27.0432C5.86778 27.0433 5.87496 27.0446 5.8629 27.0423L4.73646 32.9357ZM5.01272 32.978C5.13447 32.9916 5.2665 33 5.4073 33V27C5.50623 27 5.59663 27.0059 5.67713 27.0149L5.01272 32.978ZM23.9834 33C26.2822 33 27.6084 31.0317 27.6084 29.3036H21.6084C21.6084 28.3447 22.3748 27 23.9834 27V33ZM27.6084 29.3036C27.6084 27.5756 26.2822 25.6073 23.9834 25.6073V31.6073C22.3748 31.6073 21.6084 30.2626 21.6084 29.3036H27.6084ZM23.9834 25.6073H15.5353V31.6073H23.9834V25.6073ZM17.7682 30.6109L23.0319 24.7449L18.5662 20.7377L13.3025 26.6036L17.7682 30.6109ZM22.9313 24.8517C22.915 24.8681 22.9025 24.8803 22.8997 24.883C22.8985 24.8842 22.897 24.8857 22.8993 24.8835C22.9006 24.8822 22.9045 24.8784 22.9092 24.8738C22.9258 24.8575 22.9805 24.804 23.0453 24.7325L18.5974 20.7055C18.6275 20.6722 18.6535 20.6451 18.6725 20.6257C18.6912 20.6066 18.7057 20.5923 18.7113 20.5869C18.7142 20.5841 18.7162 20.5821 18.7156 20.5827C18.7155 20.5828 18.7154 20.5828 18.7151 20.5832C18.7148 20.5834 18.7144 20.5839 18.7139 20.5843C18.713 20.5853 18.7114 20.5868 18.7096 20.5885C18.703 20.5949 18.6868 20.6108 18.6669 20.6309L22.9313 24.8517ZM13.7678 25.6073H5.66624V31.6073H13.7678V25.6073ZM7.89912 26.6038L4.16944 22.4472L-0.29632 26.4543L3.43336 30.6109L7.89912 26.6038ZM4.1661 22.4435C4.25168 22.5385 4.25001 22.6097 4.25 22.5989L-1.75 22.6031C-1.74901 23.9956 -1.26306 25.3805 -0.292982 26.458L4.1661 22.4435ZM4.25 22.5989C4.24999 22.5874 4.25204 22.6553 4.16989 22.7468L-0.295399 18.7392C-1.26492 19.8194 -1.75099 21.2071 -1.75 22.6031L4.25 22.5989ZM4.16972 22.747L12.2838 13.7079L7.81881 9.6999L-0.295231 18.739L4.16972 22.747ZM7.81865 13.7077L17.2618 24.2293L21.7271 20.2216L12.2839 9.70008L7.81865 13.7077ZM17.2616 20.2218L11.5349 26.6037L16.0006 30.6109L21.7273 24.229L17.2616 20.2218ZM13.1678 12.7232L20.8545 4.16011L16.3895 0.152094L8.70281 8.71515L13.1678 12.7232ZM20.8547 4.15992C20.8133 4.20599 20.7415 4.26694 20.6346 4.31606C20.5264 4.36574 20.4048 4.39267 20.2845 4.39267V-1.60733C18.7556 -1.60733 17.3682 -0.938289 16.3894 0.152284L20.8547 4.15992ZM20.2845 4.39267C20.1642 4.39267 20.0429 4.36574 19.935 4.31625C19.8285 4.26732 19.757 4.20664 19.7158 4.16079L24.1794 0.151272C23.2006 -0.938361 21.8134 -1.60733 20.2845 -1.60733V4.39267ZM19.7146 4.15951L25.8302 10.9756L30.2961 6.96863L24.1805 0.152554L19.7146 4.15951ZM25.8329 10.9786C25.7492 10.8855 25.75 10.8148 25.75 10.8233L31.75 10.8196C31.7491 9.42642 31.2622 8.04245 30.2934 6.96562L25.8329 10.9786ZM25.75 10.8231C25.75 10.8316 25.749 10.7633 25.8301 10.673L30.2951 14.6809C31.2636 13.602 31.7507 12.2159 31.75 10.8199L25.75 10.8231ZM25.8298 10.6733L18.1454 19.2369L22.6111 23.2441L30.2955 14.6805L25.8298 10.6733ZM22.6109 19.2367L13.1679 8.71534L8.70264 12.723L18.1456 23.2443L22.6109 19.2367ZM5.4073 33H23.9834V27H5.4073V33Z" fill="#6969B3" mask="url(#path-1-inside-1_101_273)"/>
                    </svg>
                </Button>
                <Button chosen={chosenBrush === 'rectangle'} onClick={() => setChosenBrush('rectangle')} transparent className="tools__pen">
                    <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0V30H30V0H0ZM27 26.25H3V3.75H27V26.25Z" fill="#6969B3"/>
                    </svg>
                </Button>
                <Button chosen={chosenBrush === 'elipse'} onClick={() => setChosenBrush('elipse')} transparent className="tools__pen">
                    <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 0C6.705 0 0 6.705 0 15C0 23.295 6.705 30 15 30C23.295 30 30 23.295 30 15C30 6.705 23.295 0 15 0ZM15 27C8.37 27 3 21.63 3 15C3 8.37 8.37 3 15 3C21.63 3 27 8.37 27 15C27 21.63 21.63 27 15 27Z" fill="#6969B3"/>
                    </svg>
                </Button>
                <Button chosen={chosenBrush === 'selection_rectangle'} onClick={() => setChosenBrush('selection_rectangle')} transparent className="tools__pen">
                    <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30 0H0V30H30V0Z" fill="#6969B3"/>
                    </svg>
                </Button>
                <Button chosen={chosenBrush === 'selection_elipse'} onClick={() => setChosenBrush('selection_elipse')} transparent className="tools__pen">
                    <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 0C6.72 0 0 6.72 0 15C0 23.28 6.72 30 15 30C23.28 30 30 23.28 30 15C30 6.72 23.28 0 15 0Z" fill="#6969B3"/>
                    </svg>
                </Button>
                <Button chosen={chosenBrush === 'pipette'} onClick={() => setChosenBrush('pipette')} transparent className="tools__pen">
                    <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M29.5146 4.38689L25.6149 0.487432C24.9649 -0.162477 23.915 -0.162477 23.265 0.487432L18.0654 5.68671L14.849 2.50382L12.4991 4.85349L14.8656 7.21983L0 22.0844V30H7.91611L22.7817 15.1354L25.1482 17.5017L27.4981 15.1521L24.2983 11.9525L29.4979 6.75323C30.1646 6.08665 30.1646 5.0368 29.5146 4.38689ZM6.53288 26.6671L3.3331 23.4676L16.7655 10.0361L19.9653 13.2357L6.53288 26.6671Z" fill="#6969B3"/>
                    </svg>
                </Button>
            </div>
            <ColorPicker onChange={e => setChosenColor(e.value)} className="tools__color-picker"/>
        </div>
    )
}

export default Tools