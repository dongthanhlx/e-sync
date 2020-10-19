export function set_value_by_path(obj, path, value) {
    const obj_clone = Object.assign({}, obj);
    let setter = obj_clone;
    for (let i = 0; i < path.length; i += 1) {
        if (i === path.length - 1) {
            setter[path[i]] = value;
        } else {
            setter[path[i]] = setter[path[i]] || {};
        }
        setter = setter[path[i]]
    }
    return obj_clone;
}