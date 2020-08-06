$.validator.setDefaults( {
			submitHandler: function () {
				//both
			}
		} );



		$( document ).ready( function () {
			$( "#steadystatecalculations" ).validate( {
				success: "valid",
  			submitHandler:function(){
					if($("#steadystatecalculations").is(".done-with-tables")){
						$("#steadystatecalculations").trigger("new-tables");
					}else{
						$("#steadystatecalculations").trigger("validation-success");
					}
				},
				rules: {
					dose: {
						required: true,
						min: 0,
						max: 2000
					},
					dosinginterval: {
						required: true,
						min: 0,
						max: 48
					},
					infusionduration: {
						required: true,
						min: 0,
						max: 5
					},
					datetimepicker1: {
						required: true,
					},
					datetimepicker2: {
						required: true,
					},
					datetimepicker3: {
						required: true,
					},
					cmaxmeasured: {
						required: true,
						min: 0
					},
					cminmeasured: {
						required: true,
						min: 0
					}
				},
				messages: {
					dose: "Please enter the current maintenance dose",
					dosinginterval: "Please enter the current dosing interval",
					infusionduration: {
						required: "Please enter the current infusion duration"
					},
					datetimepicker1: {
						required: "Please provide date and time of the last dose"
					},
					datetimepicker2: {
						required: "Please provide date and time of collected peak"
					},
					datetimepicker3: {
						required: "Please provide date and time of collected trough"
					},
					cmaxmeasured: {
						required: "Please enter the peak concentration"
					},
					cminmeasured: {
						required: "Please enter the trough concentration"
					}
				},
				errorElement: "em",
				errorPlacement: function ( error, element ) {
					// Add the `help-block` class to the error element
					error.addClass( "help-block" );

					if ( element.prop( "type" ) === "checkbox" ) {
						error.insertAfter( element.parent( "label" ) );
					}
					else {
						let formGroup = element.parents(".form-group")
						let message = formGroup.find(".message")
						error.appendTo( message );
					}
				},
				highlight: function ( element, errorClass, validClass ) {
					$( element ).parents(".form-group").addClass( "has-error" ).removeClass( "has-success" );
				},
				unhighlight: function (element, errorClass, validClass) {
					$( element ).parents(".form-group").addClass( "has-success" ).removeClass( "has-error" );
				}
			} );
		} );
		$( document ).ready( function () {
			$.validator.addMethod('maxKg', function(value, element) {
				if($("#weightunits").val() == "kg" && value > 140){
					return false;
				};
				return true;
			}, 'Please enter a weight less than 140 kg');

			$.validator.addMethod('maxLb', function(value, element) {
				if($("#weightunits").val() == "lb" && value > 265){
					return false;
				};
				return true;
			}, 'Please enter a weight less than 265 lb');

			$( "#initalcalculations" ).validate( {
				submitHandler: function(form) {
					if($("#initalcalculations").is(".done-with-tables")){
						$("#initalcalculations").trigger("new-tables");
					}else{
						$("#initalcalculations").trigger("validation-success");
					}
				},
				rules: {
					age: {
						required: true,
						min: 18
					},
					gender: "required",
					SCr: {
						required: true,
						min: 0,
						max: 2
					},
					vd: {
						required: true,
						min:0,
						max: 1
					},
					weight: {
						required: true,
						min: 0,
						maxKg: true,
						maxLb: true
					},
					"weight-units": {
						required: true,
					},
					height: {
						required: true,
						min: 0
					},
					"height-units": "required",
					indication: "required",
					"specific-severe-indication": {
						required: true
					},
				},
				messages: {
					age: {
						required: "Please enter an age",
						min: "Enter an age 18 years or older"
					},
					gender: "Please select a sex",
					SCr: {
						required: "Please enter a serum creatine value"
					},
					vd: {
						required: "Please enter a vd value"
					},
					weight: {
						required: "Please enter a weight"
					},
					"weight-units": {
						required: "Please select the proper units"
					},
					height: {
						required:"Please enter a height"
					},
					"height-units": "Please select the proper units",
					indication: "Please select the appropriate indication",
					"specific-severe-indication": "Please select the actual severe indication"
				},
				errorElement: "em",
				errorPlacement: function ( error, element ) {
					// Add the `help-block` class to the error element
					error.addClass( "help-block" );
					if ( element.prop( "type" ) === "checkbox" ) {
						error.insertAfter( element.parent( "label" ) );
					}
					else {
						let formGroup = element.parents(".form-group")
						let message = formGroup.find(".message")
						error.appendTo( message );
					}
				},
				highlight: function ( element, errorClass, validClass ) {
					$( element ).parents(".form-group").addClass( "has-error" ).removeClass( "has-success" );
				},
				unhighlight: function (element, errorClass, validClass) {
					$( element ).parents(".form-group").addClass( "has-success" ).removeClass( "has-error" );
				}
			});
		});
