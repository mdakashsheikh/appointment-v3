import React, { useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

export default function AdvanceDemo() {
    let emptyData = {
        asset: [''],
    }

    const [data, setData] = useState(emptyData);

    const onDataChange = (e, name, i) => {
        let val = (e.target && e.target.value) || '';
        let _data = {...data};
        _data[name][i] = val;
        setData(_data);
    }

    const onAdd = () => {
        const newData = { ...data };
        newData.asset = [ ...data.asset, ''];
        setData(newData);
    }
    console.log(data);

    return (
        <div className="card">
            {data.asset.map((val, i) => {
                return (
                    <div className='field' key={i}>
                        <label htmlFor='data'>Asset</label>
                        <InputText
                            id='asset'
                            value={data.asset[i]}
                            onChange={(e) => onDataChange(e, 'asset', i)}
                        />
                    </div>
                )
            })}
            <Button label="Add" icon="pi pi-plus" severity="sucess" className="mr-2 mb-3 w-10rem" onClick={onAdd} />
        </div>
    )
}