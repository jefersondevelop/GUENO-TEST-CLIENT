export function dateFormatWithMonthName(date) {
	if(date != null){
		let newDate = new Date(date)
		let months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
		let stringDate = (newDate.getDate())  + " de " + months[newDate.getMonth()] + " de " + newDate.getFullYear()
		return stringDate
	}
	return date
}