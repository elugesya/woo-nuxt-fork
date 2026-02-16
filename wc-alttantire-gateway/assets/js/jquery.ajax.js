jQuery(document).ready(function ($) {

    let plugin_id = ajax_object.plugin_id;

    $(document).on('change', '#wc_alttantire-card-number', function () {

        const formatter = new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 2,
        });

        let order = ajax_object.order;

        let bin = $(this).val().replace(/\s/g, '').substring(0, 6);

        if (bin.length == 6) {
            $.ajax({
                url: ajax_object.ajaxurl,
                type: 'POST',
                data: {
                    action: 'installment',
                    bin: bin,
                },
                success: function (data) {
                    jQuery('body').trigger('update_checkout');

                    data = JSON.parse(data);

                     let table = "<tr>" +
                         "          <td><input type=\"radio\" id=\""+plugin_id+"-installment-rate-1\" name=\""+plugin_id+"-installment-rate\" value=\"1\"  data-extra-fee=\"0\"></td>" +
                         "          <td><label for=\""+plugin_id+"-installment-rate-1\">Tek Çekim</label></td>" +
                         "          <td><label for=\""+plugin_id+"-installment-rate-1\">" + " " + formatter.format(order.total) + "</label></td>" +
                         "      </tr>";


                    if (
                        data &&
                        typeof data.CommissionPackages !== "undefined" &&
                        typeof data.CommissionPackages[0] !== "undefined" &&
                        typeof data.CommissionPackages[0].InstallmentRate !== "undefined" &&
                        data.CommissionPackages[0].InstallmentRate) {

                        let installment_object = data.CommissionPackages[0].InstallmentRate;


                        for (let key in installment_object) {
                            if (installment_object.hasOwnProperty(key)) {

                                let installment = key.split("T").join("");
                                let rate = installment_object[key].Rate;
                                let constant = installment_object[key].Constant;

                                // if (installment > 1) {

                                let amount = order.total;

                                let calculated_amount = amount / (1 - (rate / 100));

                                let total_amount = Math.round((calculated_amount + constant) * 100) / 100;

                                let extra_fee = total_amount - amount;

                                let label = (installment > 1) ? installment + " Taksit" : "Tek Çekim";

                                table += "<tr>" +
                                    "          <td><input type=\"radio\" id=\"" + plugin_id + "-installment-rate-" + installment + "\" name=\"" + plugin_id + "-installment-rate\" value=\"" + installment + "\" data-extra-fee=\"" + extra_fee + "\"></td>" +
                                    "          <td><label for=\"" + plugin_id + "-installment-rate-" + installment + "\">" + label +"</label></td>" +
                                    "          <td><label for=\"" + plugin_id + "-installment-rate-" + installment + "\">" + formatter.format(total_amount) + "</label></td>" +
                                    "     </tr>";
                                // }
                            }
                        }


                    }
                    $("#installment_table").html(table);
                    $(".installment-table-div").show();


                },
                error: function (xhr, status, error) {
                    console.log(xhr, status, error);
                }
            });
        }


    });

    $(document).on('click', 'input[type=radio][name=' + plugin_id + '-installment-rate]', function () {

        $.ajax({
            url: ajax_object.ajaxurl,
            type: 'POST',

            data: {
                action: 'commission_fee',
                extra_fee: $(this).attr("data-extra-fee"),
                installment: $(this).val(),
            },
            success: function (data) {
                jQuery('body').trigger('update_checkout');
            },
            error: function (xhr, status, error) {
                console.log(xhr, status, error);
            }
        });

    });


});