import cgi
form = cgi.fieldStorage()
for e in form:
	print(e + " ")

teamName = form.getValue('team')
players = form.getValue('playername[]')
amounts = form.getValue('bidamount[]')

rawBids= []
for idx, val in players:
	bids = [teamName, val, amounts[idx]];
	rawbids.append(bids);














def main():
    pass

if __name__ == '__main__':
    main()
