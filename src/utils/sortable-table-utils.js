import {isNumber, safeRetrieve} from "./retrieve-value-utils";
import {toString} from "./tostring-utils";

export function sortByConfig(items, {attribute_path, getter}, is_ascending) {
    try {
        const result = [...items];
        if ((Array.isArray(attribute_path) && attribute_path.length > 0) || getter) {
            const use_attribute_path = !!attribute_path;
            return result.sort((item_one, item_two) => {
                const val_one = use_attribute_path ? safeRetrieve(item_one, attribute_path) : getter(item_one);
                const val_two = use_attribute_path ? safeRetrieve(item_two, attribute_path) : getter(item_two);
                return isNumber(val_one) && isNumber(val_two)
                    ? is_ascending
                        ? parseFloat(val_one) - parseFloat(val_two)
                        : parseFloat(val_two) - parseFloat(val_one)
                    : is_ascending
                        ? toString(val_one).localeCompare(toString(val_two))
                        : toString(val_two).localeCompare(toString(val_one));
            });
        } else {
            return result;
        }
    } catch (err) {
        console.error(err);
        return items;
    }
};

export function produceHeaderClassName(sortConfig, current_sort_config, is_ascending, index) {
    return sortConfig.some(config => config.column === index)
        ? current_sort_config.column === index
            ? is_ascending
                ? 'sort-column ascending'
                : 'sort-column descending'
            : 'sort-column'
        : '';
};