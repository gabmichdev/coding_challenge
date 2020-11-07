const re = /{(.*?)\}/g; // Matches ant text wrapped in {curly braces}
export const parseMessage = (message: string, fields: object) => {
	/**
	 * Function used to substitute the fields in a message. Fields between {curly braces} will be replaced
	 */
	const fieldsNeeded = message.match(re);
	const fieldsProvided = Object.entries(fields);
	if (fieldsNeeded) {
		if (fieldsNeeded.length !== fieldsProvided.length) {
			console.log(
				`A different amount of fields needed was provided. The needed that should be provided in this order are: ${fieldsNeeded
					.join(', ')
					.replace(/[{}]/g, '')}`
			);
			return null;
		}
		for (let i = 0; i < fieldsNeeded.length; i++) {
			const regex = new RegExp(fieldsNeeded[i], 'g');
			fieldsProvided[i][0] = `{${fieldsProvided[i][0]}}`;
			if (!regex.test(String(fieldsProvided[i]))) {
				console.log(
					`Process will stop since a needed field name does not match with the provided one. The needed fields that should be provided in this order are: ${fieldsNeeded
						.join(', ')
						.replace(/[{}]/g, '')}`
				);
				return null;
			}
			message = message.replace(regex, fieldsProvided[i][1]);
		}
	}
	return message;
};
