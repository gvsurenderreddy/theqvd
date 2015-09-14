#!/usr/bin/perl -w
package QVD::Client::USB::USBIP;
use base 'QVD::Client::USB';
use strict;
use QVD::Log;
use Carp;


sub new {
	my ($class) = @_;
	my $self = $class->SUPER::new(@_);
	$self->{usbip} = "/usr/sbin/usbip";
	$self->{database} = "/usr/share/hwdata/usb.ids";
	
	bless $self, $class;
	$self->refresh();
	return $self;
}

sub _cat {
	my ($self, $file) = @_;
	open(my $fh, '<', $file) or die "Can't open $file: $!";
	local $/;
	undef $/;
	my $data = <$fh>;
	$data =~ s/^\s+//;
	$data =~ s/\s+$//;
	
	close $fh;

	return $data;
}

sub get_busid {
	my ($self, $vid, $pid) = @_;
	
	my $dev = $self->get_device($vid, $pid);
	if ( defined $dev ) {
		return $dev->{busid};
	}
	
	return undef;
	
}

sub int_get_devices {
	my ($self) = @_;
	my @dev_list;

	return unless $self->{usbip};
	
	
	my $usbip = $self->{usbip};
	my @usblist = `$usbip list -l -p`;
	chomp @usblist;

	DEBUG "Getting USB devices";

	my ($vid, $pid, $busid);
	
	foreach my $line ( @usblist ) {

	
		#print "L: $line [$vid, $pid]\n";
		if ( $line =~ /^ - busid ([0-9.:-]+)\s+\(([0-9a-f]+):([0-9a-f]{4})\)/ ) {
			$busid = $1;
			$vid   = lc($2);
			$pid   = lc($3);
			#print "Found vid $vid, pid $pid, busid $busid\n";
			
			next;
		}
		
		if ( $pid && $vid ) {
			$line =~ s/^\s+//;
			$line =~ s/\s+$//;
			
			$line =~ s/\($vid:$pid\)//;
			my ($vend_name, $prod_name) = split(/:/, $line);
			my $shared = 0;
			
			if ( $prod_name =~ /unknown/ && -f "/sys/bus/usb/devices/$busid/product" ) {
				$prod_name = $self->_cat( "/sys/bus/usb/devices/$busid/product" );
			}
		
			if ( $vend_name =~ /unknown/ && -f "/sys/bus/usb/devices/$busid/manufacturer" ) {
				$vend_name = $self->_cat( "/sys/bus/usb/devices/$busid/manufacturer" );
			}
			
			if ( readlink("/sys/bus/usb/devices/$busid/driver") =~ /usbip-host/ ) {
				$shared = 1;
			}
			
			$vend_name =~ s/^\s+//;
			$vend_name =~ s/\s+$//;
			$prod_name =~ s/^\s+//;
			$prod_name =~ s/\s+$//;
			
			push @dev_list, { 
				busid     => $busid,
				vid       => $vid,
				pid       => $pid,
				vendor    => $vend_name,
				product   => $prod_name,
				shared    => $shared 
			};
			
			undef $pid;
			undef $vid;
		}
		

	}

	return \@dev_list;
}

sub share {
	my ($self, $vid, $pid) = @_;
	my @cmd;

	
	my $busid = $self->get_busid( $vid, $pid );
	die "Can't share $vid:$pid: Device not found" unless ($busid);
	$self->share_busid($busid);
}

sub share_busid {
	my ($self, $busid) = @_;
	my @cmd;
	
	push @cmd, 'sudo' if ( $self->{sudo} );
	push @cmd, ($self->{usbip}, "bind", "-b", $busid);
	
	$self->{needs_refresh} = 1;
	
	return system(@cmd) == 0;
}

sub unshare {
	my ($self, $vid, $pid) = @_;
	
	my $busid = $self->get_busid( $vid, $pid );
	die "Can't unshare $vid:$pid: Device not found" unless ($busid);
	$self->unshare_busid($busid);
}


sub unshare_busid {
	my ($self, $busid) = @_;
	my @cmd;
	
	
	push @cmd, 'sudo' if ( $self->{sudo} );
	push @cmd, ($self->{usbip}, "unbind", "-b", $busid);
	
	$self->{needs_refresh} = 1;
	
	return system(@cmd) == 0;
}

1;